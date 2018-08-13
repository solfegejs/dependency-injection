const path = require("path");
const fs = require("fs");
const configYaml = require("config-yaml");
const Container = require("./ServiceContainer/Container");
const DefinitionBuilder = require("./ServiceContainer/DefinitionBuilder");

module.exports = class Bundle {
  constructor() {
    this.definitionBuilder = new DefinitionBuilder();
    this.container = new Container();
  }

  getPath() {
    return __dirname;
  }

  initialize(application) {
    application.setParameter("serviceContainer", this.container);
    application.on("bundles_initialized", this.onBundlesInitialized);

    // The first service is the container itself
    const definition = this.container.register("container", this.container);
    definition.setClassPath(`${__dirname}${path.sep}ServiceContainer${path.sep}Container`);
  }

  async onBundlesInitialized(application) {
    // @todo in solfege?
    const configuration = application.getParameter("configuration");
    if (configuration) {
      this.container.setConfiguration(configuration);
    }

    this.loadBundleServices(application);
  }

  async loadBundleServices(application) {
    const bundles = application.getBundles();

    for (let bundle of bundles) {
      // If the bundle implements configureContainer method, then call it
      if (typeof bundle.configureContainer === "function") {
        if (bundle.configureContainer.constructor.name === "AsyncFunction") {
          await bundle.configureContainer(this.container);
        } else {
          bundle.configureContainer(this.container);
        }
      }

      // Look at the default configuration file
      const bundlePath = bundle.getPath();
      const configurationFile = `${bundlePath}${path.sep}services.yml`;
      if (fs.existsSync(configurationFile)) {
        this.loadConfigurationFile(configurationFile);
      }
    }
  }

  async boot() {
    await this.container.compile();
  }

  loadConfigurationFile(filePath) {
    const configuration = configYaml(filePath, { encoding: "utf8" });

    // Parse the services
    if (typeof configuration.services !== "object") {
      return;
    }
    for (let serviceId in configuration.services) {
      const serviceConfiguration = configuration.services[serviceId];

      // Class path is relative to configuration file if it exists
      // If the class path begins with "@", then it is an alias
      if (serviceConfiguration.class && serviceConfiguration.class[0] !== "@") {
        const directoryPath = path.dirname(filePath);
        const classPath = directoryPath + path.sep + serviceConfiguration.class;

        // Check if the class path is valid
        try {
          require.resolve(classPath);
          serviceConfiguration.class = classPath;
        } catch (error) {
          try {
            require.resolve(serviceConfiguration.class);
          } catch (error) {
            // The relative path or the original path didn't work
            throw new Error(`Service class not found: ${serviceId}`);
          }
        }
      }

      // Build definition and register it
      const definition = this.definitionBuilder.build(serviceId, serviceConfiguration);
      this.container.setDefinition(serviceId, definition);
    }
  }
};
