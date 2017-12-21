/* @flow */
import path from "path"
import fs from "fs"
import configYaml from "config-yaml"
import Container from "./ServiceContainer/Container"
import DefinitionBuilder from "./ServiceContainer/DefinitionBuilder"
import type Application from "solfegejs-application/src/Application"
import type {BundleInterface} from "solfegejs-application/src/BundleInterface"
import {bind} from "decko"

/**
 * Service container bundle
 */
export default class Bundle implements BundleInterface
{
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
    @bind
    initialize(application:Application)
    {
        // Add the container to the application parameters
        application.setParameter("serviceContainer", this.container);

        // Listen the end of bundles initialization
        application.on("bundles_initialized", this.onBundlesInitialized);

        // The first service is the container itself
        let definition = this.container.register("container", this.container);
        definition.setClassPath(`${__dirname}${path.sep}ServiceContainer${path.sep}Container`);
    }

    /**
     * The bundles are initialized
     *
     * @param   {Application}   application     Solfege application
     */
    @bind
    async onBundlesInitialized(application:Application)
    {
        let configuration = application.getParameter("configuration");
        if (configuration) {
            this.container.setConfiguration(configuration);
        }

        let bundles = application.getBundles();

        // Load services from the bundles
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
            let bundlePath = application.getBundleDirectoryPath(bundle);
            if (!bundlePath) {
                throw new Error("Unable to find bundle directory path");
            }
            let configurationFile = `${bundlePath}${path.sep}services.yml`;
            if (fs.existsSync(configurationFile)) {
                this.loadConfigurationFile(configurationFile);
            }
        }
    }

    /**
     * Boot the bundle
     */
    @bind
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
    @bind
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
