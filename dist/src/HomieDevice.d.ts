import { HomieNode } from './HomieNode';
export declare class HomieDevice {
    id: string;
    name: string;
    type: string;
    private nodes;
    constructor(id: string, name?: string, type?: string);
    addNode(node: HomieNode): void;
    removeNode(node: HomieNode): void;
    getNode(id: string): HomieNode | undefined;
    getAllNodes(): HomieNode[];
}
