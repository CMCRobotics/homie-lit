import { HomieObserver, HomieEventType, createMqttHomieObserver } from '../src/HomieObserver';
import * as mqtt from 'mqtt';
import { Subscription } from 'rxjs';

describe('HomieObserver Integration Test', () => {
  let observer: HomieObserver;
  let client: mqtt.Client;
  let homiePrefix: string;
  let subscriptions: Subscription[] = [];

  beforeAll((done) => {
    homiePrefix = `test-homie-${Math.random().toString(36).substring(7)}`;
    observer = createMqttHomieObserver('mqtt://localhost', { homiePrefix });
    client = mqtt.connect('mqtt://localhost');
    
    client.on('connect', () => {
      done();
    });
  });

  afterAll((done) => {
    const cleanup = () => {
      subscriptions.forEach(sub => sub.unsubscribe());
      subscriptions = [];
      
      if (client.connected) {
        client.end(false, {}, () => {
          if (observer && (observer as any).client && typeof (observer as any).client.end === 'function') {
            (observer as any).client.end(false, {}, done);
          } else if (observer && (observer as any).disconnect === 'function') {
            (observer as any).disconnect();
          } else {
            done();
          }
        });
      } else {
        done();
      }
    };

    cleanup();
  });

  test('should handle device creation, node addition, and property update', (done) => {
    const deviceId = 'test-device';
    const nodeId = 'test-node';
    const propertyId = 'test-property';
    let step = 0;

    const createdHandler = jest.fn();
    const updatedHandler = jest.fn();

    const cleanupAndDone = (error?: Error) => {
      subscriptions.forEach(sub => sub.unsubscribe());
      subscriptions = [];
      client.removeAllListeners('message');
      if (error) {
        done(error);
      } else {
        done();
      }
    };

    subscriptions.push(observer.created$.subscribe(createdHandler));
    subscriptions.push(observer.updated$.subscribe(updatedHandler));

    subscriptions.push(observer.created$.subscribe((event) => {
      try {
        if (step === 0 && event.type === HomieEventType.Device) {
          expect(event.device.id).toBe(deviceId);
          step++;
          client.publish(`${homiePrefix}/${deviceId}/${nodeId}/$name`, 'Test Node');
        } else if (step === 1 && event.type === HomieEventType.Node) {
          expect(event.node.id).toBe(nodeId);
          step++;
          client.publish(`${homiePrefix}/${deviceId}/${nodeId}/${propertyId}`, 'initial value');
        } else if (step === 2 && event.type === HomieEventType.Property) {
          expect(event.property.id).toBe(propertyId);
          expect(event.property.value).toBe('initial value');
          step++;
          client.publish(`${homiePrefix}/${deviceId}/${nodeId}/${propertyId}`, 'updated value');
        }
      } catch (error) {
        cleanupAndDone(error instanceof Error ? error : new Error('An unknown error occurred'));
      }
    }));

    subscriptions.push(observer.updated$.subscribe((event) => {
      try {
        if (step === 3 && event.type === HomieEventType.Property) {
          expect(event.property.id).toBe(propertyId);
          expect(event.property.value).toBe('updated value');
          
          expect(createdHandler).toHaveBeenCalledTimes(3); // Device, Node, Property
          expect(updatedHandler).toHaveBeenCalledTimes(1); // Property update
          
          cleanupAndDone();
        }
      } catch (error) {
        cleanupAndDone(error instanceof Error ? error : new Error('An unknown error occurred'));
      }
    }));

    client.publish(`${homiePrefix}/${deviceId}/$state`, 'ready');

    // Set a timeout in case we don't receive all expected messages
    const timeoutId = setTimeout(() => {
      cleanupAndDone(new Error('Timeout: Did not receive all expected messages'));
    }, 5000);

    // Clear the timeout if the test completes successfully
    subscriptions.push(observer.updated$.subscribe(() => {
      clearTimeout(timeoutId);
    }));
  });
});