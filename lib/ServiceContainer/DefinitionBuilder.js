"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _Definition = require("./Definition");

var _Definition2 = _interopRequireDefault(_Definition);

var _Reference = require("./Reference");

var _Reference2 = _interopRequireDefault(_Reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _ref(argument) {
    if (typeof argument === "string" && argument[0] === "@") {
        var _referenceArgument = new _Reference2.default(argument.substr(1));
        return _referenceArgument;
    }
    return argument;
}

var DefinitionBuilder = class DefinitionBuilder {
    constructor() {}

    build(serviceId, configuration) {
        var definition = new _Definition2.default(serviceId);

        if (configuration.class) {
            if (configuration.class[0] === "@") {
                var classReference = new _Reference2.default(configuration.class.substr(1));
                definition.setClassReference(classReference);
            } else {
                definition.setClassPath(configuration.class);
            }
        }

        if (Array.isArray(configuration.factory) && configuration.factory.length === 2) {
            var factoryServiceClass = configuration.factory[0];
            var factoryMethodName = configuration.factory[1];

            if (factoryServiceClass[0] !== "@") {
                throw new Error("Factory class must be a service: " + factoryServiceClass);
            }

            var factoryServiceReference = new _Reference2.default(factoryServiceClass.substr(1));
            definition.setFactory(factoryServiceReference, factoryMethodName);
        }

        if (Array.isArray(configuration.arguments)) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = configuration.arguments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var argument = _step.value;

                    if (argument[0] === "@") {
                        var referenceArgument = new _Reference2.default(argument.substr(1));
                        definition.addArgument(referenceArgument);
                        continue;
                    }

                    definition.addArgument(argument);
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
        }

        if (Array.isArray(configuration.calls)) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = configuration.calls[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var call = _step2.value;

                    var methodName = call[0];
                    var methodArguments = call[1] || [];

                    methodArguments = methodArguments.map(_ref);

                    definition.addMethodCall(methodName, methodArguments);
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
        }

        if (Array.isArray(configuration.tags)) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = configuration.tags[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var tag = _step3.value;

                    definition.addTag(tag);
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
        }

        return definition;
    }
};
exports.default = DefinitionBuilder;