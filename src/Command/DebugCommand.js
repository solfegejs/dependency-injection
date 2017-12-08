/* @flow */
import colors from "colors/safe"
import type {ContainerInterface} from "../../interface"

/**
 * Debug command
 */
export default class DebugCommand
{
    /**
     * Service container
     */
    container:ContainerInterface;

    /**
     * Command name
     */
    name:string;

    /**
     * Command description
     */
    description:string;

    /**
     * Constructor
     */
    constructor()
    {
        // Initialize properties
        this.description = "";
    }

    /**
     * Set the service container
     *
     * @param   {Container}     container   Service container
     */
    setContainer(container:ContainerInterface):void
    {
        this.container = container;
    }

    /**
     * Get the service container
     *
     * @return  {Container}                 Service container
     */
    getContainer():ContainerInterface
    {
        return this.container;
    }

    /**
     * Get command name
     *
     * @return  {string}    Command name
     */
    getName():string
    {
        return this.name;
    }

    /**
     * Set command name
     *
     * @param   {string}    name    Command name
     */
    setName(name:string):void
    {
        this.name = name;
    }

    /**
     * Get command description
     *
     * @return  {string}    Command description
     */
    getDescription():string
    {
        return this.description;
    }

    /**
     * Set command description
     *
     * @param   {string}    description     Command description
     */
    setDescription(description:string):void
    {
        this.description = description;
    }


    /**
     * Configure command
     */
    async configure()
    {
        this.setName("dependency-injection:debug");
        this.setDescription("Debug dependency injection");
    }

    /**
     * Execute the command
     */
    async execute()
    {
        let container = this.getContainer();
        let definitions = container.getDefinitions();

        console.info(colors.yellow("Services"));
        console.info(colors.yellow("========"));
        console.info("");
        for (let [id, definition] of definitions) {
            console.info(colors.green("ID   : ") + colors.bgBlack.cyan(`${id}`));
            console.info(colors.green("Class: ") + definition.getClassPath());
            console.info("");
        }
    }
}
