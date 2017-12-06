/* @flow */
import type Application from "solfegejs/src/Application"
import type {BundleInterface, InitializableBundleInterface} from "solfegejs/src/BundleInterface"

/**
 * Example bundle
 */
export default class Bundle implements BundleInterface, InitializableBundleInterface
{
    /**
     * Constructor
     */
    constructor():void
    {
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

    initialize(app:Application)
    {
        app.on("start", this.onStart);
        console.log("Bundle initialized");
    }

    async onStart(app:Application, parameters:Array<String> = [])
    {
        console.log("started");

        let container = app.getParameter("serviceContainer");
        console.log("Service container:", container);

        let selfService = await container.get("container");
        console.log("Service container from service container:", selfService);
    }
}
