import { HomieProperty } from './HomieProperty';
export declare class HomieNode {
    id: string;
    name: string;
    type: string;
    private properties;
    constructor(id: string, name?: string, type?: string);
    addProperty(property: HomieProperty): void;
    getProperty(id: string): HomieProperty | undefined;
    getAllProperties(): HomieProperty[];
}
