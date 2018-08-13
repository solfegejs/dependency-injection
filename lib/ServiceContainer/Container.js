const assert = require("assert");
const Definition = require("./Definition");
const Reference = require("./Reference");

module.exports = class Container {
  constructor() {
    this.definitions = new Map();

    this.parameterResolvers = [];
    this.compilers = new Set();
    this.compiled = false;
  }

  addParameterResolver(resolver) {
    this.parameterResolvers.push(resolver);
  }

  setDefinition(id, definition) {
    this.definitions.set(id, definition);
  }

  getDefinition(id) {
    if (!this.definitions.has(id)) {
      throw new Error(`Service definition not found: ${id}`);
    }

    const definition = this.definitions.get(id);
    assert.ok(definition instanceof Definition, `Service definition not found: ${id}`);

    return definition;
  }

  getDefinitions() {
    return this.definitions;
  }

  register(id, service) {
    const definition = new Definition(id);
    definition.setInstance(service);

    this.definitions.set(id, definition);

    return definition;
  }

  getReference(id) {
    return new Reference(id);
  }

  addCompilerPass(compiler) {
    assert.strictEqual(typeof compiler.process, "function", "Compiler pass should contain process function");

    this.compilers.add(compiler);
  }

  findTaggedServiceIds(tagName) {
    const ids = [];

    for (let [serviceId, definition] of this.definitions.entries()) {
      const tags = definition.getTags();
      let tagFound = false;
      for (let tag of tags) {
        if (tag.name && tag.name === tagName) {
          tagFound = true;
          break;
        }
      }

      if (tagFound) {
        ids.push(serviceId);
      }
    }

    return ids;
  }

  async compile() {
    // The container is compiled only once
    if (this.compiled) {
      return;
    }

    // Process each compiler pass
    for (let compiler of this.compilers) {
      if (typeof compiler.process !== "function") {
        continue;
      }
      if (compiler.process.constructor.name === "AsyncFunction") {
        await compiler.process(this);
      } else {
        compiler.process(this);
      }
    }

    // The container is compiled
    this.compiled = true;
  }

  async get(id) {
    // The container must be compiled
    assert.ok(this.compiled, `Unable to get service "${id}", the container is not compiled`);

    // Get the definition
    let definition = this.getDefinition(id);

    // Get the instance if it exists
    let instance = definition.getInstance();
    if (instance) {
      return instance;
    }

    // Build the instance
    instance = await this.buildInstance(definition);
    return instance;
  }

  async getServiceClassPath(id) {
    // The container must be compiled
    assert.ok(this.compiled, `Unable to get service "${id}", the container is not compiled`);

    // Get the definition
    let definition = this.getDefinition(id);

    return await this.getDefinitionClassPath(definition);
  }

  async getDefinitionClassPath(definition) {
    let classPath = definition.getClassPath();

    if (classPath) {
      return classPath;
    }

    let classReference = definition.getClassReference();
    if (classReference instanceof Reference) {
      let classServiceId = classReference.getId();
      let classDefinition = this.getDefinition(classServiceId);
      classPath = await this.getDefinitionClassPath(classDefinition);
    }

    return classPath;
  }

  async buildInstance(definition) {
    let instance;
    let instanceArguments = definition.getArguments();

    // Resolve arguments
    let instanceArgumentsResolved = [];
    for (let instanceArgument of instanceArguments) {
      let instanceArgumentResolved = await this.resolveParameter(instanceArgument);
      instanceArgumentsResolved.push(instanceArgumentResolved);
    }

    // Instantiate with a class
    let classPath = await this.getDefinitionClassPath(definition);
    if (typeof classPath === "string") {
      try {
        let classObject = require(classPath);
        if (typeof classObject !== "function" && typeof classObject.default === "function") {
          classObject = classObject.default;
        }
        if (typeof classObject !== "function") {
          throw new Error(`No class found in "${classPath}"`);
        }

        instance = Reflect.construct(classObject, instanceArgumentsResolved);
      } catch (error) {
        throw new Error(`Unable to instantiate service "${classPath}": ${error.message}`);
      }
    }

    // Instantiate with a factory
    let factoryServiceReference = definition.getFactoryServiceReference();
    if (!instance && factoryServiceReference instanceof Reference) {
      let factoryServiceId = factoryServiceReference.getId();
      let factoryService = await this.get(factoryServiceId);
      let factoryMethodName = definition.getFactoryMethodName();
      let factoryMethod = factoryService[factoryMethodName];

      if (typeof factoryMethod === "function") {
        instance = await factoryMethod.apply(factoryService, instanceArgumentsResolved);
      } else {
        throw new Error(`Factory method must be a function: service ${definition.getId()}`);
      }
    }

    // The instance must be created
    if (!instance) {
      throw new Error(`Unable to instantiate service: ${definition.getId()}`);
    }

    // Call methods
    let methodCalls = definition.getMethodCalls();
    for (let methodCall of methodCalls) {
      let { name, parameters } = methodCall;
      let method = instance[name];

      assert.strictEqual(typeof method, "function", `Method "${name}" not found in ${classPath}`);

      // Resolve parameters
      let parametersResolved = [];
      for (let parameter of parameters) {
        let parameterResolved = await this.resolveParameter(parameter);
        parametersResolved.push(parameterResolved);
      }

      // Call the method
      if (method.constructor.name === "AsyncFunction") {
        await method.apply(instance, parametersResolved);
      } else {
        method.apply(instance, parametersResolved);
      }
    }

    definition.setInstance(instance);

    return instance;
  }

  async resolveParameter(parameter) {
    // If the parameter is a service reference, then return the service instance
    if (parameter instanceof Reference) {
      let serviceId = parameter.getId();
      let service = await this.get(serviceId);
      return service;
    }

    // The parameter should be a string now
    if (typeof parameter !== "string") {
      return parameter;
    }

    // If the parameter is a service reference in string format, then return the serviec instance
    if (parameter[0] === "@") {
      let serviceId = parameter.substr(1);
      let service = await this.get(serviceId);
      return service;
    }

    // Fallback to the customized resolvers
    for (let resolver of this.parameterResolvers) {
      const resolvedParameter = resolver(parameter);
      if (resolvedParameter !== undefined) {
        return resolvedParameter;
      }
    }

    return parameter;
  }
}
