/* @flow */
import path from "path"
import fs from "fs"
import configYaml from "config-yaml"
import Container from "./ServiceContainer/Container"
import DefinitionBuilder from "./ServiceContainer/DefinitionBuilder"
import type Application from "solfegejs/src/Application"
import type Configuration from "solfegejs/src/Configuration"
import type {BundleInterface} from "solfegejs/src/BundleInterface"

/**
 * Service container bundle
 */
export default class Bundle implements BundleInterface
{
    /**
     * Solfege Application
     */
    application:Application;

    /**
     * Definition builder
     */
    definitionBuilder:DefinitionBuilder;

    /**
     * Service container
     */
    container:Container;

    /**
     * Constructor
     */
    constructor()
    {
        // Initialize the definition builder
        this.definitionBuilder = new DefinitionBuilder();

        // Initialize the service container
        this.container = new Container();
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath():string
    {
        return __dirname;
    }

    /**
     * Initialize the bundle
     *
     * @param   {Application}  application     Solfege application
     */
    initialize(application:Application)
    {
        this.application = application;

        // Add the container to the application parameters
        this.application.setParameter("serviceContainer", this.container);

        // Listen the end of configuration loading
        this.application.on("configuration_loaded", this.onConfigurationLoaded.bind(this));

        // Listen the end of bundles initialization
        this.application.on("bundles_initialized", this.onBundlesInitialized.bind(this));

        // The first service is the container itself
        let definition = this.container.register("container", this.container);
        definition.setClassPath(`${__dirname}${path.sep}ServiceContainer${path.sep}Container`);
    }

    /**
     * The configuration is loaded
     *
     * @param   {Application}       application     Solfege application
     * @param   {Configuration}     configuration   Solfege configuration
     */
    onConfigurationLoaded(application:Application, configuration:Configuration)
    {
        this.container.setConfiguration(configuration);
    }

    /**
     * The bundles are initialized
     */
    async onBundlesInitialized()
    {
        let bundles = this.application.getBundles();

        // Load services from the bundles
        for (let bundle of bundles) {
            // If the bundle implements configureContainer method, then call it
            if (typeof bundle.configureContainer === "function") {
                await bundle.configureContainer(this.container);
            }

            // Otherwise, look at the default configuration file
            let bundlePath = this.application.getBundleDirectoryPath(bundle);
            if (!bundlePath) {
                throw new Error("Unable to find bundle directory path");
            }
            let configurationFile = `${bundlePath}${path.sep}services.yml`;
            if (await fs.exists(configurationFile)) {
                this.loadConfigurationFile(configurationFile);
            }
        }
    }

    /**
     * Boot the bundle
     */
    async boot()
    {
        // Compile
        await this.container.compile();

        // The container is ready
    }

    /**
     * Load a configuration file
     *
     * @param   {String}    filePath    The file path
     */
    loadConfigurationFile(filePath:string)
    {
        let configuration = configYaml(filePath, {encoding: "utf8"});

        // Parse the services
        if (typeof configuration.services !== "object") {
            return;
        }
        for (let serviceId in configuration.services) {
            let serviceConfiguration = configuration.services[serviceId];

            // Class path is relative to configuration file if it exists
            // If the class path begins with "@", then it is an alias
            if (serviceConfiguration.class && serviceConfiguration.class[0] !== "@") {
                let directoryPath = path.dirname(filePath);
                let classPath =  directoryPath + path.sep + serviceConfiguration.class;

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
            let definition = this.definitionBuilder.build(serviceId, serviceConfiguration);
            this.container.setDefinition(serviceId, definition);
        }
    }
}
