/* @flow */

/**
 * Reference interface
 */
export interface ReferenceInterface
{
    /**
     * Get service id
     *
     * @return  {String}        Service id
     */
    getId():string;
}

/**
 * Definition interface
 */
export interface DefinitionInterface
{
    /**
     * Get service id
     *
     * @return  {String}            Service id
     */
    getId():string;

    /**
     * Set the instance
     *
     * @param   {*}     service     Service instance
     */
    setInstance(service:any):void;

    /**
     * Get the instance
     *
     * @return  {*}                 Service instance
     */
    getInstance():any;

    /**
     * Set class path
     *
     * @param   {String}    path    Class path
     */
    setClassPath(path:string):void;

    /**
     * Get class path
     *
     * @return  {String}            Class path
     */
    getClassPath():string;

    /**
     * Set class reference
     *
     * @param   {Reference}     reference       Class reference
     */
    setClassReference(reference:ReferenceInterface):void;

    /**
     * Get class reference
     *
     * @return  {Reference}                     Class reference
     */
    getClassReference():ReferenceInterface;

    /**
     * Set factory method
     *
     * @param   {Reference}     serviceReference    Service reference
     * @param   {string}        methodName          Method name
     */
    setFactory(serviceReference:ReferenceInterface, methodName:string):void;

    /**
     * Get factory service reference
     *
     * @return  {Reference}     Service reference
     */
    getFactoryServiceReference():ReferenceInterface;

    /**
     * Get factory method name
     *
     * @return  {string}        Method name
     */
    getFactoryMethodName():string;

    /**
     * Add constructor argument
     *
     * @param   {*}     argument    Class constructor argument
     */
    addArgument(argument:*):void;

    /**
     * Get constructor arguments
     *
     * @return  {Set}               Class constructor arguments
     */
    getArguments():Set<*>;

    /**
     * Add tag
     *
     * @param   {Object}    tag     Tag
     */
    addTag(tag:Object):void;

    /**
     * Get tags
     *
     * @return  {Set}               Tags
     */
    getTags():Set<Object>;

    /**
     * Add a method call
     *
     * @param   {String}    name        Method name
     * @param   {Array}     parameters  Method parameters
     */
    addMethodCall(name:string, parameters:Array<*>):void;

    /**
     * Get method calls
     *
     * @return  {Set}                   Method calls
     */
    getMethodCalls():Set<Object>;
}

/**
 * Container interface
 */
export interface ContainerInterface
{
    /**
     * Get a service definition
     *
     * @param   {String}                id              Service id
     * @return  {DefinitionInterface}                   Service definition
     */
    getDefinition(id:string):DefinitionInterface;

    /**
     * Set a service definition
     *
     * @param   {String}                id              Service id
     * @param   {DefinitionInterface}   definition      Service definition
     */
    setDefinition(id:string, definition:DefinitionInterface):void;

    /**
     * Get service definitions
     *
     * @return  {Map}       Definitions
     */
    getDefinitions():Map<string, DefinitionInterface>;

    /**
     * Get service reference
     *
     * @param   {String}                id      Service id
     * @return  {ReferenceInterface}            Service reference
     */
    getReference(id:string):ReferenceInterface;

    /**
     * Register an instantiated service
     *
     * @param   {String}                id          Service id
     * @param   {*}                     service     Service instance
     * @return  {DefinitionInterface}               Serice definition
     */
    register(id:string, service:any):DefinitionInterface;

    /**
     * Add a compiler pass
     *
     * @param   {CompilerPassInterface}     compiler    Compiler pass
     */
    addCompilerPass(compiler:CompilerPassInterface):void;

    /**
     * Find services ids tagged the specified name
     *
     * @param   {String}    tagName     Tag name
     * @return  {Array}                 Service ids
     */
    findTaggedServiceIds(tagName:string):Array<string>;

    /**
     * Get service instance
     *
     * @param   {String}        id          Service id
     * @return  {*}                         Service instance
     */
    get(id:string):*;

    /**
     * Get service class path
     *
     * @param   {String}        id          Service id
     * @return  {String}                    Service class path
     */
    getServiceClassPath(id:string):Generator<*,string,*>;

    /**
     * Get definition class path
     *
     * @param   {Definition}    definition  Service definition
     * @return  {String}                    Service class path
     */
    getDefinitionClassPath(definition:DefinitionInterface):Generator<*,string,*>;

    /**
     * Build definition instance
     *
     * @param   {Definition}    definition      Service definition
     * @return  {*}                             Service instance
     */
    buildInstance(definition:DefinitionInterface):Generator<*,*,*>;

    /**
     * Resolve a parameter
     *
     * @param   {*}     parameter   The parameter
     * @return  {*}                 The resolved parameter
     */
    resolveParameter(parameter:any):Generator<*,*,*>;
}

/**
 * Container compiler pass interface
 */
export interface CompilerPassInterface
{
    /**
     * Process
     *
     * @param   {ContainerInterface}    container   Container
     */
    process(container:ContainerInterface):Generator<*,*,*>;
}


