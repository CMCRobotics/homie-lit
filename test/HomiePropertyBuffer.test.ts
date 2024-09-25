import { HomieObserver, HomieEventType, HomieEvent, MqttMessageHandler } from '../src/HomieObserver';
import { HomiePropertyBuffer } from '../src/HomiePropertyBuffer';

class MockMqttClient implements MqttMessageHandler {
  constructor(private callback: (event: HomieEvent) => void) {}

  handleMessage(topic: string, message: Buffer): void {
    const [, deviceId, nodeId, propertyId] = topic.split('/');
    const value = message.toString();

    if (propertyId) {
      this.callback({
        type: HomieEventType.Property,
        device: { id: deviceId, nodes: {} },
        node: { id: nodeId, properties: {} },
        property: { id: propertyId, value }
      });
    }
  }

  subscribe(topic: string): void {}
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

  const simulatePropertyUpdates = (updates: [string, string, string, string][]) => {
    updates.forEach(([deviceId, nodeId, propertyId, value]) => {
      mockMqttClient.handleMessage(`homie/${deviceId}/${nodeId}/${propertyId}`, Buffer.from(value));
    });
  };

  const collectBufferedUpdates = (count: number): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const updates: any[] = [];
      const subscription = propertyBuffer.getBufferedUpdates().subscribe({
        next: (bufferedUpdates) => {
          updates.push(...bufferedUpdates);
          if (updates.length >= count) {
            subscription.unsubscribe();
            resolve(updates);
          }
        },
        error: reject
      });

      setTimeout(() => {
        subscription.unsubscribe();
        reject(new Error('Test timed out'));
      }, 5000);
    });
  };

  it('should buffer updates and emit them', async () => {
    const updatePromise = collectBufferedUpdates(2);
    simulatePropertyUpdates([
      ['device1', 'node1', 'prop1', 'value1'],
      ['device1', 'node1', 'prop2', 'value2']
    ]);

    const updates = await updatePromise;
    expect(updates).toHaveLength(2);
    expect(updates[0]).toMatchObject({ deviceId: 'device1', nodeId: 'node1', propertyId: 'prop1', value: 'value1' });
    expect(updates[1]).toMatchObject({ deviceId: 'device1', nodeId: 'node1', propertyId: 'prop2', value: 'value2' });
  });

  it('should sort properties by priority', async () => {
    propertyBuffer.addPropertyGroup({ name: 'High Priority', properties: ['node1/prop1'], priority: 2 });
    propertyBuffer.addPropertyGroup({ name: 'Low Priority', properties: ['node1/prop2'], priority: 1 });

    const updatePromise = collectBufferedUpdates(2);
    simulatePropertyUpdates([
      ['device1', 'node1', 'prop2', 'value2'],
      ['device1', 'node1', 'prop1', 'value1']
    ]);

    const updates = await updatePromise;
    expect(updates).toHaveLength(2);
    expect(updates[0]).toMatchObject({ propertyId: 'prop1', value: 'value1' });
    expect(updates[1]).toMatchObject({ propertyId: 'prop2', value: 'value2' });
  });

  it('should keep properties together in their group', async () => {
    propertyBuffer.addPropertyGroup({
      name: 'Group1',
      properties: ['node1/prop1', 'node1/prop2', 'node1/prop3'],
      priority: 1
    });

    const updatePromise = collectBufferedUpdates(3);
    simulatePropertyUpdates([
      ['device1', 'node1', 'prop2', 'value2'],
      ['device1', 'node1', 'prop3', 'value3'],
      ['device1', 'node1', 'prop1', 'value1']
    ]);

    const updates = await updatePromise;
    expect(updates).toHaveLength(3);
    expect(updates.map(u => u.propertyId)).toEqual(['prop1', 'prop2', 'prop3']);
  });

  it('should handle multiple groups with different priorities', async () => {
    propertyBuffer.addPropertyGroup({
      name: 'Group1',
      properties: ['node1/prop1', 'node1/prop2'],
      priority: 2
    });
    propertyBuffer.addPropertyGroup({
      name: 'Group2',
      properties: ['node1/prop3', 'node1/prop4'],
      priority: 1
    });

    const updatePromise = collectBufferedUpdates(4);
    simulatePropertyUpdates([
      ['device1', 'node1', 'prop3', 'value3'],
      ['device1', 'node1', 'prop1', 'value1'],
      ['device1', 'node1', 'prop4', 'value4'],
      ['device1', 'node1', 'prop2', 'value2']
    ]);

    const updates = await updatePromise;
    expect(updates).toHaveLength(4);
    expect(updates.map(u => u.propertyId)).toEqual(['prop1', 'prop2', 'prop3', 'prop4']);
  });
});