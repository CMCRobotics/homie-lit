export declare class HomieProperty {
    id: string;
    name: string;
    value: any;
    dataType: any;
    format: string;
    constructor(id: string, name: string, value: any, dataType: any, format?: string);
    setValue(newValue: any): void;
    getValue(): any;
}
