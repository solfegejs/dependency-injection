"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _desc, _value, _class;

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Definition = require("./Definition");

var _Definition2 = _interopRequireDefault(_Definition);

var _Reference = require("./Reference");

var _Reference2 = _interopRequireDefault(_Reference);

var _decko = require("decko");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

var Container = (_class = class Container {
    constructor() {
        this.definitions = new Map();

        this.compilers = new Set();
        this.compiled = false;
    }

    setConfiguration(configuration) {
        this.configuration = configuration;
    }

    getConfiguration() {
        return this.configuration;
    }

    setDefinition(id, definition) {
        this.definitions.set(id, definition);
    }

    getDefinition(id) {
        if (!this.definitions.has(id)) {
            throw new Error("Service definition not found: " + id);
        }

        var definition = this.definitions.get(id);
        _assert2.default.ok(definition instanceof _Definition2.default, "Service definition not found: " + id);

        return definition;
    }

    getDefinitions() {
        return this.definitions;
    }

    register(id, service) {
        var definition = new _Definition2.default(id);
        definition.setInstance(service);

        this.definitions.set(id, definition);

        return definition;
    }

    getReference(id) {
        var reference = new _Reference2.default(id);

        return reference;
    }

    addCompilerPass(compiler) {
        _assert2.default.strictEqual(_typeof(compiler.process), "function", "Compiler pass should contain process function");

        this.compilers.add(compiler);
    }

    findTaggedServiceIds(tagName) {
        var ids = [];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.definitions.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ref = _step.value;

                var _ref2 = _slicedToArray(_ref, 2);

                var serviceId = _ref2[0];
                var definition = _ref2[1];

                var tags = definition.getTags();
                var tagFound = false;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = tags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var tag = _step2.value;

                        if (tag.name && tag.name === tagName) {
                            tagFound = true;
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                if (tagFound) {
                    ids.push(serviceId);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return ids;
    }

    async compile() {
        if (this.compiled) {
            return;
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = this.compilers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var compiler = _step3.value;

                if (typeof compiler.process !== "function") {
                    continue;
                }
                if (compiler.process.constructor.name === "AsyncFunction") {
                    await compiler.process(this);
                } else {
                    compiler.process(this);
                }
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        this.compiled = true;
    }

    async get(id) {
        _assert2.default.ok(this.compiled, "Unable to get service \"" + id + "\", the container is not compiled");

        var definition = this.getDefinition(id);

        var instance = definition.getInstance();
        if (instance) {
            return instance;
        }

        instance = await this.buildInstance(definition);
        return instance;
    }

    async getServiceClassPath(id) {
        _assert2.default.ok(this.compiled, "Unable to get service \"" + id + "\", the container is not compiled");

        var definition = this.getDefinition(id);

        return await this.getDefinitionClassPath(definition);
    }

    async getDefinitionClassPath(definition) {
        var classPath = definition.getClassPath();

        if (classPath) {
            return classPath;
        }

        var classReference = definition.getClassReference();
        if (classReference instanceof _Reference2.default) {
            var classServiceId = classReference.getId();
            var classDefinition = this.getDefinition(classServiceId);
            classPath = await this.getDefinitionClassPath(classDefinition);
        }

        return classPath;
    }

    async buildInstance(definition) {
        var instance = void 0;
        var instanceArguments = definition.getArguments();

        var instanceArgumentsResolved = [];
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = instanceArguments[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var instanceArgument = _step4.value;

                var instanceArgumentResolved = await this.resolveParameter(instanceArgument);
                instanceArgumentsResolved.push(instanceArgumentResolved);
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        var classPath = await this.getDefinitionClassPath(definition);
        if (typeof classPath === "string") {
            try {
                var classObject = require(classPath);
                if (typeof classObject !== "function" && typeof classObject.default === "function") {
                    classObject = classObject.default;
                }
                if (typeof classObject !== "function") {
                    throw new Error("No class found in \"" + classPath + "\"");
                }

                instance = Reflect.construct(classObject, instanceArgumentsResolved);
            } catch (error) {
                throw new Error("Unable to instantiate service \"" + classPath + "\": " + error.message);
            }
        }

        var factoryServiceReference = definition.getFactoryServiceReference();
        if (!instance && factoryServiceReference instanceof _Reference2.default) {
            var factoryServiceId = factoryServiceReference.getId();
            var factoryService = await this.get(factoryServiceId);
            var factoryMethodName = definition.getFactoryMethodName();
            var factoryMethod = factoryService[factoryMethodName];

            if (typeof factoryMethod === "function") {
                instance = await factoryMethod.apply(factoryService, instanceArgumentsResolved);
            } else {
                throw new Error("Factory method must be a function: service " + definition.getId());
            }
        }

        if (!instance) {
            throw new Error("Unable to instantiate service: " + definition.getId());
        }

        var methodCalls = definition.getMethodCalls();
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = methodCalls[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var methodCall = _step5.value;
                var name = methodCall.name,
                    parameters = methodCall.parameters;

                var method = instance[name];

                _assert2.default.strictEqual(typeof method === "undefined" ? "undefined" : _typeof(method), "function", "Method \"" + name + "\" not found in " + classPath);

                var parametersResolved = [];
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = parameters[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var parameter = _step6.value;

                        var parameterResolved = await this.resolveParameter(parameter);
                        parametersResolved.push(parameterResolved);
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                if (method.constructor.name === "AsyncFunction") {
                    await method.apply(instance, parametersResolved);
                } else {
                    method.apply(instance, parametersResolved);
                }
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                    _iterator5.return();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }

        return instance;
    }

    async resolveParameter(parameter) {
        if (parameter instanceof _Reference2.default) {
            var serviceId = parameter.getId();
            var service = await this.get(serviceId);
            return service;
        }

        if (typeof parameter !== "string") {
            return parameter;
        }

        if (parameter[0] === "@") {
            var _serviceId = parameter.substr(1);
            var _service = await this.get(_serviceId);
            return _service;
        }

        var resolvedParameter = this.configuration.resolvePropertyValue(parameter);

        return resolvedParameter;
    }
}, (_applyDecoratedDescriptor(_class.prototype, "setConfiguration", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "setConfiguration"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getConfiguration", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "getConfiguration"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setDefinition", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "setDefinition"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getDefinition", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "getDefinition"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getDefinitions", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "getDefinitions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "register", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "register"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getReference", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "getReference"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "addCompilerPass", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "addCompilerPass"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "findTaggedServiceIds", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "findTaggedServiceIds"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "compile", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "compile"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "get", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "get"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getServiceClassPath", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "getServiceClassPath"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getDefinitionClassPath", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "getDefinitionClassPath"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "buildInstance", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "buildInstance"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "resolveParameter", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "resolveParameter"), _class.prototype)), _class);
exports.default = Container;