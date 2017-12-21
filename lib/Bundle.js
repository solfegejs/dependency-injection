"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _desc, _value, _class;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _configYaml = require("config-yaml");

var _configYaml2 = _interopRequireDefault(_configYaml);

var _Container = require("./ServiceContainer/Container");

var _Container2 = _interopRequireDefault(_Container);

var _DefinitionBuilder = require("./ServiceContainer/DefinitionBuilder");

var _DefinitionBuilder2 = _interopRequireDefault(_DefinitionBuilder);

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

var Bundle = (_class = class Bundle {
    constructor() {
        this.definitionBuilder = new _DefinitionBuilder2.default();

        this.container = new _Container2.default();
    }

    getPath() {
        return __dirname;
    }

    initialize(application) {
        application.setParameter("serviceContainer", this.container);

        application.on("bundles_initialized", this.onBundlesInitialized);

        var definition = this.container.register("container", this.container);
        definition.setClassPath("" + __dirname + _path2.default.sep + "ServiceContainer" + _path2.default.sep + "Container");
    }

    async onBundlesInitialized(application) {
        var configuration = application.getParameter("configuration");
        if (configuration) {
            this.container.setConfiguration(configuration);
        }

        var bundles = application.getBundles();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = bundles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var bundle = _step.value;

                if (typeof bundle.configureContainer === "function") {
                    if (bundle.configureContainer.constructor.name === "AsyncFunction") {
                        await bundle.configureContainer(this.container);
                    } else {
                        bundle.configureContainer(this.container);
                    }
                }

                var bundlePath = application.getBundleDirectoryPath(bundle);
                if (!bundlePath) {
                    throw new Error("Unable to find bundle directory path");
                }
                var configurationFile = "" + bundlePath + _path2.default.sep + "services.yml";
                if (_fs2.default.existsSync(configurationFile)) {
                    this.loadConfigurationFile(configurationFile);
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
    }

    async boot() {
        await this.container.compile();
    }

    loadConfigurationFile(filePath) {
        var configuration = (0, _configYaml2.default)(filePath, { encoding: "utf8" });

        if (_typeof(configuration.services) !== "object") {
            return;
        }
        for (var serviceId in configuration.services) {
            var serviceConfiguration = configuration.services[serviceId];

            if (serviceConfiguration.class && serviceConfiguration.class[0] !== "@") {
                var directoryPath = _path2.default.dirname(filePath);
                var classPath = directoryPath + _path2.default.sep + serviceConfiguration.class;

                try {
                    require.resolve(classPath);
                    serviceConfiguration.class = classPath;
                } catch (error) {
                    try {
                        require.resolve(serviceConfiguration.class);
                    } catch (error) {
                        throw new Error("Service class not found: " + serviceId);
                    }
                }
            }

            var definition = this.definitionBuilder.build(serviceId, serviceConfiguration);
            this.container.setDefinition(serviceId, definition);
        }
    }
}, (_applyDecoratedDescriptor(_class.prototype, "initialize", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "initialize"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onBundlesInitialized", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "onBundlesInitialized"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "boot", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "boot"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "loadConfigurationFile", [_decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "loadConfigurationFile"), _class.prototype)), _class);
exports.default = Bundle;