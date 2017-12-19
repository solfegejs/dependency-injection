/* @flow */
import assert from "assert"
import Definition from "./Definition"
import Reference from "./Reference"
import type {ContainerInterface, ReferenceInterface, DefinitionInterface, CompilerPassInterface} from "../../interface"

/**
 * Service container
 */
export default class Container implements ContainerInterface
{
    /**
     * Symfony configuration
     */
    configuration:any;

    /**
     * Definitions
     */
    definitions:Map<string,DefinitionInterface>;

    /**
     * Compilers
     */
    compilers:Set<CompilerPassInterface>;

    /**
     * Indicates that the container is compiled
     */
    compiled:boolean;

    /**
     * Constructor
     */
    constructor():void
    {
        // Initialize definitions
        this.definitions = new Map();

        // Initialize compilers
        this.compilers = new Set();
        this.compiled = false;
    }

    /**
     * Set the configuration
     *
     * @param   {Configuration}     configuration       Solfege configuration
     */
    setConfiguration(configuration:any):void
    {
        this.configuration = configuration;
    }

    /**
     * Get the configuration
     *
     * @return  {Configuration}     Solfege configuration
     */
    getConfiguration():any
    {
        return this.configuration;
    }

    /**
     * Set a service definition
     *
     * @param   {String}        id              Service id
     * @param   {Definition}    definition      Service definition
     */
    setDefinition(id:string, definition:DefinitionInterface):void
    {
        this.definitions.set(id, definition);
    }

    /**
     * Get a service definition
     *
     * @param   {String}        id              Service id
     * @return  {Definition}                    Service definition
     */
    getDefinition(id:string):DefinitionInterface
    {
        if (!this.definitions.has(id)) {
            throw new Error(`Service definition not found: ${id}`);
        }

        let definition = this.definitions.get(id);
        assert.ok(definition instanceof Definition, `Service definition not found: ${id}`);

        // $FlowFixMe: FLow does not understand that the definition exists
        return definition;
    }

    /**
     * Get service definitions
     *
     * @return  {Map}       Definitions
     */
    getDefinitions():Map<string, DefinitionInterface>
    {
        return this.definitions;
    }

    /**
     * Register an instantiated service
     *
     * @param   {String}        id          Service id
     * @param   {*}             service     Service instance
     * @return  {Definition}                Serice definition
     */
    register(id:string, service:any):Definition
    {
        let definition = new Definition(id);
        definition.setInstance(service);

        this.definitions.set(id, definition);

        return definition;
    }

    /**
     * Get service reference
     *
     * @param   {String}    id      Service id
     * @return  {Reference}         Service reference
     */
    getReference(id:string):ReferenceInterface
    {
        let reference = new Reference(id);

        return reference;
    }

    /**
     * Add a compiler pass
     *
     * @param   {CompilerPassInterface}     compiler    Compiler pass
     */
    addCompilerPass(compiler:CompilerPassInterface):void
    {
        assert.strictEqual(typeof compiler.process, "function", "Compiler pass should contain process function");

        this.compilers.add(compiler);
    }

    /**
     * Find services ids tagged the specified name
     *
     * @param   {String}    tagName     Tag name
     * @return  {Array}                 Service ids
     */
    findTaggedServiceIds(tagName:string):Array<string>
    {
        let ids = [];

        for (let [serviceId, definition] of this.definitions.entries()) {
            let tags = definition.getTags();
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

    /**
     * Compile
     */
    async compile():*
    {
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

    /**
     * Get service instance
     *
     * @param   {String}        id          Service id
     * @return  {*}                         Service instance
     */
    async get(id:string):*
    {
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


    /**
     * Get service class path
     *
     * @param   {String}        id          Service id
     * @return  {String}                    Service class path
     */
    async getServiceClassPath(id:string):Promise<string>
    {
        // The container must be compiled
        assert.ok(this.compiled, `Unable to get service "${id}", the container is not compiled`);

        // Get the definition
        let definition:DefinitionInterface = this.getDefinition(id);

        return await this.getDefinitionClassPath(definition);
    }

    /**
     * Get definition class path
     *
     * @param   {Definition}    definition  Service definition
     * @return  {String}                    Service class path
     */
    async getDefinitionClassPath(definition:DefinitionInterface):Promise<string>
    {
        let classPath:string = definition.getClassPath();

        if (classPath) {
            return classPath;
        }

        let classReference = definition.getClassReference();
        if (classReference instanceof Reference) {
            let classServiceId:string = classReference.getId();
            let classDefinition:DefinitionInterface = this.getDefinition(classServiceId);
            classPath = await this.getDefinitionClassPath(classDefinition);
        }

        return classPath;
    }

    /**
     * Build definition instance
     *
     * @param   {Definition}    definition      Service definition
     * @return  {*}                             Service instance
     */
    async buildInstance(definition:DefinitionInterface):Promise<*>
    {
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
            let {name, parameters} = methodCall;
            let method = instance[name];

            assert.strictEqual(typeof method, "function", `Method "${name}" not found in ${classPath}`);

            // Resolve parameters
            let parametersResolved = []
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

        return instance;
    }

    /**
     * Resolve a parameter
     *
     * @param   {*}     parameter   The parameter
     * @return  {*}                 The resolved parameter
     */
    async resolveParameter(parameter:any):Promise<*>
    {
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

        // Replace configuration properties
        let resolvedParameter = this.configuration.resolvePropertyValue(parameter);

        return resolvedParameter;
    }
}
