import { HomieObserver, HomieEventType, HomieEvent, MqttMessageHandler } from '../src/HomieObserver';

// Mock MQTT Client
class MockMqttClient implements MqttMessageHandler {
  private callback: (event: HomieEvent) => void;

  constructor(callback: (event: HomieEvent) => void) {
    this.callback = callback;
  }

  handleMessage(topic: string, message: Buffer): void {
    const [, deviceId, nodeId, propertyId] = topic.split('/');
    const value = message.toString();

    if (nodeId === '$state') {
      this.callback({
        type: HomieEventType.Device,
        device: { id: deviceId, nodes: {} }
      });
    } else if (propertyId === undefined) {
      this.callback({
        type: HomieEventType.Node,
        device: { id: deviceId, nodes: {} },
        node: { id: nodeId, properties: {} }
      });
    } else {
      this.callback({
        type: HomieEventType.Property,
        device: { id: deviceId, nodes: {} },
        node: { id: nodeId, properties: {} },
        property: { id: propertyId, value }
      });
    }
  }

  subscribe(topic: string): void {
    // no-op - mock implementation
  }
}

describe('HomieObserver', () => {
  let observer: HomieObserver;
  let mockMqttClient: MockMqttClient;

  beforeEach(() => {
    mockMqttClient = new MockMqttClient((event) => observer.processEvent(event));
    observer = new HomieObserver(mockMqttClient);
  });

  test('should emit created event when a new device is added', (done) => {
    observer.created$.subscribe((event) => {
      expect(event.type).toBe(HomieEventType.Device);
      expect(event.device.id).toBe('device1');
      done();
    });

    mockMqttClient.handleMessage('homie/device1/$state', Buffer.from('ready'));
  });

  test('should emit created event when a new node is added', (done) => {
    observer.created$.subscribe((event) => {
      if (event.type === HomieEventType.Node) {
        expect(event.device.id).toBe('device1');
        expect(event.node.id).toBe('node1');
        done();
      }
    });

    mockMqttClient.handleMessage('homie/device1/node1', Buffer.from(''));
  });

  test('should emit updated event when a property value is changed', (done) => {
    let createCount = 0;
    observer.created$.subscribe(() => {
      createCount++;
      if (createCount === 3) {  // Device, Node, and Property created
        mockMqttClient.handleMessage('homie/device1/node1/property1', Buffer.from('new value'));
      }
    });

    observer.updated$.subscribe((event) => {
      if (event.type === HomieEventType.Property) {
        expect(event.device.id).toBe('device1');
        expect(event.node.id).toBe('node1');
        expect(event.property.id).toBe('property1');
        expect(event.property.value).toBe('new value');
        done();
      }
    });

    // Simulate initial creation of device, node, and property
    mockMqttClient.handleMessage('homie/device1/$state', Buffer.from('ready'));
    mockMqttClient.handleMessage('homie/device1/node1', Buffer.from(''));
    mockMqttClient.handleMessage('homie/device1/node1/property1', Buffer.from('initial value'));
  });
});