const assert = require("assert");
const Reference = require("./Reference");

module.exports = class Definition {
  constructor(id) {
    assert(typeof id === "string", new TypeError(`${id} is not a string, it cannot be used as service identifier`));

    this.id = id;
    this.arguments = new Set();
    this.tags = new Set();
    this.methodCalls = new Set();
  }

  getId() {
    return this.id;
  }

  setInstance(instance) {
    this.instance = instance;
  }

  getInstance() {
    return this.instance;
  }

  setClassPath(path) {
    this.classPath = path;
  }

  getClassPath() {
    return this.classPath;
  }

  setClassReference(reference) {
    assert(reference instanceof Reference, new TypeError(`Unable to set class reference to definition, invalid type`));

    this.classReference = reference;
  }

  getClassReference() {
    return this.classReference;
  }

  setFactory(serviceReference, methodName) {
    this.factoryServiceReference = serviceReference;
    this.factoryMethodName = methodName;
  }

  getFactoryServiceReference() {
    return this.factoryServiceReference;
  }

  getFactoryMethodName() {
    return this.factoryMethodName;
  }

  addArgument(argument) {
    this.arguments.add(argument);
  }

  getArguments() {
    return this.arguments;
  }

  addTag(tag) {
    this.tags.add(tag);
  }

  getTags() {
    return this.tags;
  }

  addMethodCall(name, parameters = []) {
    this.methodCalls.add({
      name: name,
      parameters: parameters
    });
  }

  getMethodCalls() {
    return this.methodCalls;
  }
};
