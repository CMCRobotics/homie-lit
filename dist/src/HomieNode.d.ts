import { HomieProperty } from './HomieProperty';
export declare class HomieNode {
    name: string;
    private properties;
    constructor(name: string);
    addProperty(property: HomieProperty): void;
    getProperty(name: string): HomieProperty | undefined;
    getAllProperties(): HomieProperty[];
}
