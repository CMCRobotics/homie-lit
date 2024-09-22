import { HomieNode } from './HomieNode';
export declare class HomieDevice {
    name: string;
    private nodes;
    constructor(name: string);
    addNode(node: HomieNode): void;
    removeNode(node: HomieNode): void;
    getNode(name: string): HomieNode | undefined;
    getAllNodes(): HomieNode[];
}
