"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _coFs = require("co-fs");

var _coFs2 = _interopRequireDefault(_coFs);

var _configYaml = require("config-yaml");

var _configYaml2 = _interopRequireDefault(_configYaml);

var _bindGenerator = require("bind-generator");

var _bindGenerator2 = _interopRequireDefault(_bindGenerator);

var _isGenerator = require("is-generator");

var _Container = require("./ServiceContainer/Container");

var _Container2 = _interopRequireDefault(_Container);

var _DefinitionBuilder = require("./ServiceContainer/DefinitionBuilder");

var _DefinitionBuilder2 = _interopRequireDefault(_DefinitionBuilder);

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Application = _solfegejs2.default.Application;

var Bundle = class Bundle {
    constructor() {
        this.definitionBuilder = new _DefinitionBuilder2.default();

        this.container = new _Container2.default();
    }

    getPath() {
        return __dirname;
    }

    *initialize(application) {
        this.application = application;

        this.application.on("configuration_loaded", (0, _bindGenerator2.default)(this, this.onConfigurationLoaded));

        this.application.on("bundles_initialized", (0, _bindGenerator2.default)(this, this.onBundlesInitialized));

        var definition = this.container.register("container", this.container);
        definition.setClassPath("" + __dirname + _path2.default.sep + "ServiceContainer" + _path2.default.sep + "Container");
    }

    *onConfigurationLoaded(application, configuration) {
        this.container.setConfiguration(configuration);
    }

    *onBundlesInitialized() {
        var bundles = this.application.getBundles();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = bundles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var bundle = _step.value;

                if ((0, _isGenerator.fn)(bundle.configureContainer)) {
                    yield bundle.configureContainer(this.container);
                }

                var bundlePath = this.application.getBundleDirectoryPath(bundle);
                if (!bundlePath) {
                    throw new Error("Unable to find bundle directory path");
                }
                var configurationFile = "" + bundlePath + _path2.default.sep + "services.yml";
                if (yield _coFs2.default.exists(configurationFile)) {
                    yield this.loadConfigurationFile(configurationFile);
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

    *boot() {
        yield this.container.compile();
    }

    *loadConfigurationFile(filePath) {
        var configuration = (0, _configYaml2.default)(filePath, { encoding: "utf8" });

        if (_typeof(configuration.services) !== 'object') {
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
};
exports.default = Bundle;
module.exports = exports["default"];