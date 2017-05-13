/* @flow */
import type {ReferenceInterface} from "../../interface"

/**
 * Service reference
 */
export default class Reference implements ReferenceInterface
{
    /**
     * Identifier
     */
    id:string;

    /**
     * Constructor
     *
     * @param   {String}    id  Service id
     */
    constructor(id:string):void
    {
        this.id = id;
    }

    /**
     * Get service id
     *
     * @return  {String}        Service id
     */
    getId():string
    {
        return this.id;
    }
}
