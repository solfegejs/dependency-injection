"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Definition = class Definition {
  constructor(id) {
    this.id = id;
    this.arguments = new Set();
    this.tags = new Set();
    this.methodCalls = new Set();
  }

  getId() {
    return this.id;
  }

  setInstance(service) {
    this.instance = service;
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

  addMethodCall(name) {
    var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    this.methodCalls.add({
      name: name,
      parameters: parameters
    });
  }

  getMethodCalls() {
    return this.methodCalls;
  }
};
exports.default = Definition;
module.exports = exports["default"];