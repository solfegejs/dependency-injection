const Definition = require("./Definition");
const Reference = require("./Reference");

module.exports = class DefinitionBuilder {
  build(serviceId, configuration) {
    let definition = new Definition(serviceId);

    this.setClass(definition, configuration);
    this.setFactory(definition, configuration);
    this.addArguments(definition, configuration);
    this.addMethodCalls(definition, configuration);
    this.addTags(definition, configuration);

    return definition;
  }

  setClass(definition, configuration) {
    if (!configuration.class) {
      return;
    }

    if (configuration.class[0] === "@") {
      const classReference = new Reference(configuration.class.substr(1));
      definition.setClassReference(classReference);
    } else {
      definition.setClassPath(configuration.class);
    }
  }

  setFactory(definition, configuration) {
    if (!Array.isArray(configuration.factory)) {
      return;
    }

    if (configuration.factory.length !== 2) {
      return;
    }

    const [className, methodName] = configuration.factory;

    if (className[0] !== "@") {
      throw new Error(`Factory class must be a service: ${className}`);
    }

    const serviceReference = new Reference(className.substr(1));
    definition.setFactory(serviceReference, methodName);
  }

  resolveReferences(list) {
    return list.map(item => {
      if (typeof item === "string" && item[0] === "@") {
        return new Reference(item.substr(1));
      }
      return item;
    });
  }

  addArguments(definition, configuration) {
    if (!Array.isArray(configuration.arguments)) {
      return;
    }

    const resolvedArguments = this.resolveReferences(configuration.arguments);
    for (let argument of resolvedArguments) {
      definition.addArgument(argument);
    }
  }

  addMethodCalls(definition, configuration) {
    if (!Array.isArray(configuration.calls)) {
      return;
    }

    for (let call of configuration.calls) {
      const methodName = call[0];
      const methodArguments = call[1] || [];

      this.addMethodCall(definition, methodName, methodArguments);
    }
  }

  addMethodCall(definition, methodName, methodArguments) {
    const resolveddArguments = this.resolveReferences(methodArguments);
    definition.addMethodCall(methodName, resolvedArguments);
  }

  addTags(definition, configuration) {
    if (!Array.isArray(configuration.tags)) {
      return;
    }

    for (let tag of configuration.tags) {
      definition.addTag(tag);
    }
  }
};
