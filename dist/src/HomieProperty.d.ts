export declare class HomieProperty {
    id: string;
    name: string;
    value: any;
    dataType: any;
    constructor(id: string, name: string, value: any, dataType: any);
    setValue(newValue: any): void;
    getValue(): any;
}
