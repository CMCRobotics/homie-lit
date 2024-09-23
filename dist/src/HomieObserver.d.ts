/// <reference types="node" />
import { Observable } from 'rxjs';
import mqtt from 'mqtt';
declare module 'mqtt' {
    interface Client {
        on(event: 'connect', callback: () => void): this;
        on(event: 'message', callback: (topic: string, message: Buffer) => void): this;
        subscribe(topic: string | string[], options?: mqtt.IClientSubscribeOptions, callback?: mqtt.ClientSubscribeCallback): this;
        end(force?: boolean, options?: object, callback?: () => void): this;
    }
    interface IClientOptions {
    }
    function connect(brokerUrl: string, options?: IClientOptions): Client;
}
interface HomieProperty {
    id: string;
    value: any;
}
interface HomieNode {
    id: string;
    properties: {
        [key: string]: HomieProperty;
    };
}
interface HomieDevice {
    id: string;
    nodes: {
        [key: string]: HomieNode;
    };
}
declare enum HomieEventType {
    Device = "device",
    Node = "node",
    Property = "property"
}
interface HomieDeviceEvent {
    type: HomieEventType.Device;
    device: HomieDevice;
}
interface HomieNodeEvent {
    type: HomieEventType.Node;
    device: HomieDevice;
    node: HomieNode;
}
interface HomiePropertyEvent {
    type: HomieEventType.Property;
    device: HomieDevice;
    node: HomieNode;
    property: HomieProperty;
}
type HomieEvent = HomieDeviceEvent | HomieNodeEvent | HomiePropertyEvent;
interface MqttMessageHandler {
    handleMessage(topic: string, message: Buffer): void;
}
declare class MqttClient implements MqttMessageHandler {
    private client;
    private homiePrefix;
    private messageCallback;
    constructor(brokerUrl: string, options: {
        homiePrefix?: string | undefined;
    } | undefined, messageCallback: (event: HomieEvent) => void);
    subscribe(pattern: string): void;
    private getSubscriptionTopic;
    handleMessage(topic: string, message: Buffer): void;
    private handleDeviceState;
    private handleNodeState;
    private handlePropertyState;
    disconnect(): void;
}
declare class HomieObserver {
    private messageHandler;
    private devices;
    private onCreate;
    private onUpdate;
    private onDelete;
    constructor(messageHandler: MqttMessageHandler);
    get created$(): Observable<HomieEvent>;
    get updated$(): Observable<HomieEvent>;
    get deleted$(): Observable<HomieEvent>;
    processEvent(event: HomieEvent): void;
    private processDeviceEvent;
    private processNodeEvent;
    private processPropertyEvent;
}
declare function createMqttHomieObserver(brokerUrl: string, options?: {
    homiePrefix?: string;
}): HomieObserver;
export { HomieObserver, MqttClient, MqttMessageHandler, createMqttHomieObserver, HomieEventType, HomieEvent };
