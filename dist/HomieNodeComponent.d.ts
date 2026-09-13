import { HomieNode } from './HomieNode';
export declare class HomieNodeComponent extends HTMLElement {
    private node;
    private bindingManager;
    constructor(node: HomieNode);
    connectedCallback(): void;
    render(): void;
}
