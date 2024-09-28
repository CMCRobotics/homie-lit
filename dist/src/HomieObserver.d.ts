/// <reference types="node" />
import { Observable } from 'rxjs';
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
    subscribe(topic: string): void;
    publish(topic: string, message: string | Buffer): void;
}
declare class MqttClient implements MqttMessageHandler {
    private client;
    private homiePrefix;
    private messageCallback;
    constructor(brokerUrl: string, options: {
        homiePrefix?: string | undefined;
    } | undefined, messageCallback: (event: HomieEvent) => void);
    subscribe(pattern: string): void;
    publish(topic: string, message: string | Buffer): void;
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
    subscribe(topic: string): void;
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
