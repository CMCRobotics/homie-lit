import { HomieObserver } from './HomieObserver';
export type Transformer = (value: any) => any;
export declare class PropertyBindingManager {
    private observer?;
    private bindings;
    private transformers;
    constructor(observer?: HomieObserver | undefined);
    private registerDefaultTransformers;
    registerTransformer(name: string, transformer: Transformer): void;
    getTransformer(name: string): Transformer | undefined;
    private setupSubscription;
    bindPath(path: string, element: HTMLElement, attribute: string, transformer?: Transformer | string): void;
    private updateBindingsForPath;
}
