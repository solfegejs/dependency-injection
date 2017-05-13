/* @flow */
import type {ReferenceInterface} from "../../interface"

/**
 * Service definition
 */
export default class Definition
{
    /**
     * Identifier
     */
    id:string;

    /**
     * Instance
     */
    instance:any;

    /**
     * Class path
     */
    classPath:string;

    /**
     * Class reference
     */
    classReference:ReferenceInterface;

    /**
     * Reference of the factory service
     */
    factoryServiceReference:ReferenceInterface;

    /**
     * Factory method name
     */
    factoryMethodName:string;

    /**
     * Arguments
     */
    arguments:Set<*>;

    /**
     * Tags
     */
    tags:Set<Object>;

    /**
     * Method calls
     */
    methodCalls:Set<Object>;

    /**
     * Constructor
     *
     * @param   {String}    id      Service id
     */
    constructor(id:string):void
    {
        // Initialize properties
        this.id = id;
        this.arguments = new Set();
        this.tags = new Set();
        this.methodCalls = new Set();
    }

    /**
     * Get service id
     *
     * @return  {String}            Service id
     */
    getId():string
    {
        return this.id;
    }

    /**
     * Set the instance
     *
     * @param   {*}     service     Service instance
     */
    setInstance(service:any):void
    {
        this.instance = service;
    }

    /**
     * Get the instance
     *
     * @return  {*}                 Service instance
     */
    getInstance():any
    {
        return this.instance;
    }

    /**
     * Set class path
     *
     * @param   {String}    path    Class path
     */
    setClassPath(path:string):void
    {
        this.classPath = path;
    }

    /**
     * Get class path
     *
     * @return  {String}            Class path
     */
    getClassPath():string
    {
        return this.classPath;
    }

    /**
     * Set class reference
     *
     * @param   {Reference}     reference       Class reference
     */
    setClassReference(reference:ReferenceInterface):void
    {
        this.classReference = reference;
    }

    /**
     * Get class reference
     *
     * @return  {Reference}                     Class reference
     */
    getClassReference():ReferenceInterface
    {
        return this.classReference;
    }

    /**
     * Set factory method
     *
     * @param   {Reference}     serviceReference    Service reference
     * @param   {string}        methodName          Method name
     */
    setFactory(serviceReference:ReferenceInterface, methodName:string):void
    {
        this.factoryServiceReference = serviceReference;
        this.factoryMethodName = methodName;
    }

    /**
     * Get factory service reference
     *
     * @return  {Reference}     Service reference
     */
    getFactoryServiceReference():ReferenceInterface
    {
        return this.factoryServiceReference;
    }

    /**
     * Get factory method name
     *
     * @return  {string}        Method name
     */
    getFactoryMethodName():string
    {
        return this.factoryMethodName;
    }

    /**
     * Add constructor argument
     *
     * @param   {*}     argument    Class constructor argument
     */
    addArgument(argument:*):void
    {
        this.arguments.add(argument);
    }

    /**
     * Get constructor arguments
     *
     * @return  {Set}               Class constructor arguments
     */
    getArguments():Set<*>
    {
        return this.arguments;
    }

    /**
     * Add tag
     *
     * @param   {Object}    tag     Tag
     */
    addTag(tag:Object)
    {
        this.tags.add(tag);
    }

    /**
     * Get tags
     *
     * @return  {Set}               Tags
     */
    getTags():Set<Object>
    {
        return this.tags;
    }

    /**
     * Add a method call
     *
     * @param   {String}    name        Method name
     * @param   {Array}     parameters  Method parameters
     */
    addMethodCall(name:string, parameters:Array<*> = [])
    {
        this.methodCalls.add({
            name: name,
            parameters: parameters
        });
    }

    /**
     * Get method calls
     *
     * @return  {Set}                   Method calls
     */
    getMethodCalls():Set<Object>
    {
        return this.methodCalls;
    }
}
