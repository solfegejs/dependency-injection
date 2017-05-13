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
     * @param   {String}        id              Service id
     * @return  {Definition}                    Service definition
     */
    getDefinition(id:string):DefinitionInterface;

    /**
     * Get service definitions
     *
     * @return  {Map}       Definitions
     */
    getDefinitions():Map<string, DefinitionInterface>;

}
