import { Subject, Observable } from 'rxjs';
import mqtt from 'mqtt';
import logger from './logger';

// Interfaces
interface HomieProperty {
  id: string;
  value: any;
}

interface HomieNode {
  id: string;
  properties: { [key: string]: HomieProperty };
}

interface HomieDevice {
  id: string;
  nodes: { [key: string]: HomieNode };
}

// Enum for event types
enum HomieEventType {
  Device = 'device',
  Node = 'node',
  Property = 'property'
}

// Event interfaces
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

// Interface for MQTT message handler
interface MqttMessageHandler {
  handleMessage(topic: string, message: Buffer): void;
  subscribe(topic: string): void;
  publish(topic: string, message: string | Buffer) : void;
}

// MQTT Client class
class MqttClient implements MqttMessageHandler {
  private client: mqtt.Client;
  private homiePrefix: string;
  private messageCallback: (event: HomieEvent) => void;

  constructor(brokerUrl: string, options: { homiePrefix?: string } = {}, messageCallback: (event: HomieEvent) => void) {
    this.client = mqtt.connect(brokerUrl);
    this.homiePrefix = options.homiePrefix || 'homie';
    this.messageCallback = messageCallback;
    this.client.on('connect', () => logger.info('Connected to MQTT broker'));
    this.client.on('message', (topic, message) => this.handleMessage(topic, message));
  }

  public subscribe(pattern: string): void {
    const subscriptionTopic = this.getSubscriptionTopic(pattern);
    this.client.subscribe(subscriptionTopic);
  }

  public publish(topic: string, message: string | Buffer) : void {
    this.client.publish(this.homiePrefix+"/"+topic, message);
  }

  private getSubscriptionTopic(pattern: string): string {
    return pattern.startsWith(this.homiePrefix) ? pattern : `${this.homiePrefix}/${pattern}`;
  }

  public handleMessage(topic: string, message: Buffer): void {
    const topicParts = topic.split('/');
    if (topicParts[0] !== this.homiePrefix || topicParts.length < 3) return;

    const [, deviceId, nodeId, propertyId] = topicParts;
    const value = message.toString();

    if (nodeId === '$state') {
      this.handleDeviceState(deviceId, value);
    } else if (propertyId === undefined) {
      this.handleNodeState(deviceId, nodeId, value);
    } else {
      this.handlePropertyState(deviceId, nodeId, propertyId, value);
    }
  }

  private handleDeviceState(deviceId: string, state: string): void {
    const device: HomieDevice = { id: deviceId, nodes: {} };
    const event: HomieDeviceEvent = { type: HomieEventType.Device, device };
    this.messageCallback(event);
  }

  private handleNodeState(deviceId: string, nodeId: string, state: string): void {
    const device: HomieDevice = { id: deviceId, nodes: {} };
    const node: HomieNode = { id: nodeId, properties: {} };
    const event: HomieNodeEvent = { type: HomieEventType.Node, device, node };
    this.messageCallback(event);
  }

  private handlePropertyState(deviceId: string, nodeId: string, propertyId: string, value: string): void {
    const device: HomieDevice = { id: deviceId, nodes: {} };
    const node: HomieNode = { id: nodeId, properties: {} };
    const property: HomieProperty = { id: propertyId, value };
    const event: HomiePropertyEvent = { type: HomieEventType.Property, device, node, property };
    this.messageCallback(event);
  }

  public disconnect(): void {
    if(this.client && (! this.client.disconnected) ){
      this.client.end();
    }
  }
}

// Homie Observer class
class HomieObserver {
  private devices: { [key: string]: HomieDevice } = {};
  private onCreate = new Subject<HomieEvent>();
  private onUpdate = new Subject<HomieEvent>();
  private onDelete = new Subject<HomieEvent>();

  constructor(private messageHandler: MqttMessageHandler) {
    console.log('HomieObserver constructor called');
  }

  
  public subscribe(topic: string): void {
    this.messageHandler.subscribe(topic);
  }

  public publish(topic: string, message: string | Buffer) : void {
    this.messageHandler.publish(topic, message);
  }

  public get created$(): Observable<HomieEvent> {
    return this.onCreate.asObservable();
  }

  public get updated$(): Observable<HomieEvent> {
    return this.onUpdate.asObservable();
  }

  public get deleted$(): Observable<HomieEvent> {
    return this.onDelete.asObservable();
  }

  public processEvent(event: HomieEvent): void {
    console.log('HomieObserver processing event:', event);
    switch (event.type) {
      case HomieEventType.Device:
        this.processDeviceEvent(event);
        break;
      case HomieEventType.Node:
        this.processNodeEvent(event);
        break;
      case HomieEventType.Property:
        this.processPropertyEvent(event);
        break;
    }
  }

  private processDeviceEvent(event: HomieDeviceEvent): void {
    const { device } = event;
    if (!this.devices[device.id]) {
      this.devices[device.id] = device;
      this.onCreate.next(event);
    } else {
      this.onUpdate.next(event);
    }
  }

  private processNodeEvent(event: HomieNodeEvent): void {
    const { device, node } = event;
    if (!this.devices[device.id]) {
      this.devices[device.id] = device;
      this.onCreate.next({ type: HomieEventType.Device, device });
    }
    
    if (!this.devices[device.id].nodes[node.id]) {
      this.devices[device.id].nodes[node.id] = node;
      this.onCreate.next(event);
    } else {
      this.onUpdate.next(event);
    }
  }

  private processPropertyEvent(event: HomiePropertyEvent): void {
    logger.debug('Processing property event', { event });
    const { device, node, property } = event;
    if (!this.devices[device.id]) {
      this.devices[device.id] = device;
      this.onCreate.next({ type: HomieEventType.Device, device });
      logger.debug('Emitted create event for device', { deviceId: device.id });
    }
    
    if (!this.devices[device.id].nodes[node.id]) {
      this.devices[device.id].nodes[node.id] = node;
      this.onCreate.next({ type: HomieEventType.Node, device, node });
      logger.debug('Emitted create event for node', { deviceId: device.id, nodeId: node.id });
    }
    
    const existingProperty = this.devices[device.id].nodes[node.id].properties[property.id];
    if (!existingProperty) {
      this.devices[device.id].nodes[node.id].properties[property.id] = property;
      this.onCreate.next(event);
      this.onUpdate.next(event);  // Emit both create and update for new properties
      logger.debug('Emitted create and update events for new property', { deviceId: device.id, nodeId: node.id, propertyId: property.id });
    } else if (existingProperty.value !== property.value) {
      this.devices[device.id].nodes[node.id].properties[property.id] = property;
      this.onUpdate.next(event);
      logger.debug('Emitted update event for property', { deviceId: device.id, nodeId: node.id, propertyId: property.id });
    }
  }
}

// Factory function to create HomieObserver with MQTT client
function createMqttHomieObserver(brokerUrl: string, options: { homiePrefix?: string } = {}): HomieObserver {
  let observer: HomieObserver;
  const mqttClient = new MqttClient(brokerUrl, options, (event: HomieEvent) => {
    if (observer) {
      observer.processEvent(event);
    }
  });
  observer = new HomieObserver(mqttClient);
  return observer;
}


export { HomieObserver, MqttClient, MqttMessageHandler, createMqttHomieObserver, HomieEventType, HomieEvent };