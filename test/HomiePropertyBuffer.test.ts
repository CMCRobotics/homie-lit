// HomiePropertyBuffer.test.ts
import { HomieObserver, HomieEventType, HomieEvent, MqttMessageHandler } from '../src/HomieObserver';
import { HomiePropertyBuffer } from '../src/HomiePropertyBuffer';

class MockMqttClient implements MqttMessageHandler {
  private callback: (event: HomieEvent) => void;

  constructor(callback: (event: HomieEvent) => void) {
    this.callback = callback;
  }

  handleMessage(topic: string, message: Buffer): void {
    console.log(`MockMqttClient handling message: ${topic} - ${message.toString()}`);
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
      console.log('Calling callback with Property event');
      this.callback({
        type: HomieEventType.Property,
        device: { id: deviceId, nodes: {} },
        node: { id: nodeId, properties: {} },
        property: { id: propertyId, value }
      });
    }
  }

  subscribe(topic: string): void {
    console.log(`MockMqttClient subscribed to: ${topic}`);
  }
}

describe('HomiePropertyBuffer', () => {
  let propertyBuffer: HomiePropertyBuffer;
  let observer: HomieObserver;
  let mockMqttClient: MockMqttClient;

  beforeEach(() => {
    mockMqttClient = new MockMqttClient((event) => observer.processEvent(event));
    observer = new HomieObserver(mockMqttClient);
    propertyBuffer = new HomiePropertyBuffer(observer, 100);
  });

  it('should buffer updates and emit them', (done) => {
    console.log('Starting test');

    const updates: any[] = [];
    const subscription = propertyBuffer.getBufferedUpdates().subscribe({
      next: (bufferedUpdates) => {
        console.log('Received buffered updates in test:', bufferedUpdates);
        updates.push(...bufferedUpdates);
        if (updates.length === 2) {
          expect(updates[0]).toEqual(expect.objectContaining({
            deviceId: 'device1',
            nodeId: 'node1',
            propertyId: 'prop1',
            value: 'value1'
          }));
          expect(updates[1]).toEqual(expect.objectContaining({
            deviceId: 'device1',
            nodeId: 'node1',
            propertyId: 'prop2',
            value: 'value2'
          }));
          subscription.unsubscribe();
          done();
        }
      },
      error: (err) => {
        console.error('Error in test subscription:', err);
        done(err);
      }
    });

    console.log('Simulating MQTT messages');
    mockMqttClient.handleMessage('homie/device1/node1/prop1', Buffer.from('value1'));
    mockMqttClient.handleMessage('homie/device1/node1/prop2', Buffer.from('value2'));

    // Increase timeout to 5 seconds
    setTimeout(() => {
      console.log('Test timed out');
      subscription.unsubscribe();
      done(new Error('Test timed out'));
    }, 5000);
  });
});