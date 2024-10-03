import { HomieObserver, HomieEventType, createMqttHomieObserver } from '../src/HomieObserver';
import * as mqtt from 'mqtt';
import { Subscription } from 'rxjs';
import * as dotenv from 'dotenv';
dotenv.config();

describe('HomieObserver Integration Tests', () => {
  let observer: HomieObserver;
  let client: mqtt.Client;
  const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost';
  let homiePrefix: string;
  let subscriptions: Subscription[] = [];

  beforeEach((done) => {
    homiePrefix = `test-homie-${Math.random().toString(36).substring(7)}`;
    observer = createMqttHomieObserver(brokerUrl, { homiePrefix });
    client = mqtt.connect(brokerUrl);
    
    client.on('connect', () => {
      done();
    });
  });

  afterEach((done) => {
    const cleanup = () => {
      subscriptions.forEach(sub => sub.unsubscribe());
      subscriptions = [];
      
      if (client.connected) {
        client.end(false, {}, () => {
          if ((observer as any).messageHandler && typeof (observer as any).messageHandler.end === 'function') {
            (observer as any).messageHandler.end(false, {}, done);
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

  test('should receive and process a simple device event', (done) => {
    const deviceId = 'test-device';
    let eventReceived = false;

    const subscribeTopic = `${homiePrefix}/${deviceId}/#`;
    observer.subscribe(subscribeTopic);

    subscriptions.push(observer.created$.subscribe(
      (event) => {
        if (event.type === HomieEventType.Device) {
          expect(event.device.id).toBe(deviceId);
          eventReceived = true;
        }
      },
      (error) => {
        console.error('Error in subscription:', error);
        done(error);
      }
    ));

    const publishTopic = `${homiePrefix}/${deviceId}/$state`;
    const publishMessage = 'ready';
    const publishOptions: mqtt.IClientPublishOptions = { qos: 1 };

    client.publish(publishTopic, publishMessage, publishOptions, (err) => {
      if (err) {
        console.error('Failed to publish:', err);
        done(err);
        return;
      }

      setTimeout(() => {
        if (!eventReceived) {
          done(new Error('Event not received within timeout'));
        } else {
          expect(eventReceived).toBe(true);
          done();
        }
      }, 500);
    });
  });

  test('should report discovery of a new device via created$ subject', (done) => {
    const deviceId = 'new-device';
    const subscribeTopic = `${homiePrefix}/${deviceId}/#`;
    observer.subscribe(subscribeTopic);

    subscriptions.push(observer.created$.subscribe(
      (event) => {
        if (event.type === HomieEventType.Device) {
          expect(event.device.id).toBe(deviceId);
          done();
        }
      },
      (error) => {
        console.error('Error in subscription:', error);
        done(error);
      }
    ));

    client.publish(`${homiePrefix}/${deviceId}/$state`, 'init', { qos: 1 });
  });

  test('should report discovery of a new node via created$ subject', (done) => {
    const deviceId = 'device-with-node';
    const nodeId = 'new-node';
    const subscribeTopic = `${homiePrefix}/${deviceId}/#`;
    observer.subscribe(subscribeTopic);

    let deviceCreated = false;

    subscriptions.push(observer.created$.subscribe(
      (event) => {
        if (event.type === HomieEventType.Device) {
          deviceCreated = true;
        } else if (event.type === HomieEventType.Node && deviceCreated) {
          expect(event.device.id).toBe(deviceId);
          expect(event.node.id).toBe(nodeId);
          done();
        }
      },
      (error) => {
        console.error('Error in subscription:', error);
        done(error);
      }
    ));

    client.publish(`${homiePrefix}/${deviceId}/$state`, 'init', { qos: 1 }, () => {
      client.publish(`${homiePrefix}/${deviceId}/${nodeId}/$name`, 'Test Node', { qos: 1 });
    });
  });

  test('should report update of a property via updated$ subject', (done) => {
    const deviceId = 'device-with-property';
    const nodeId = 'node-with-property';
    const propertyId = 'test-property';
    const subscribeTopic = `${homiePrefix}/${deviceId}/#`;
    observer.subscribe(subscribeTopic);

    let propertyCreated = false;

    subscriptions.push(observer.created$.subscribe(
      (event) => {
        if (event.type === HomieEventType.Property) {
          propertyCreated = true;
        }
      }
    ));

    subscriptions.push(observer.updated$.subscribe(
      (event) => {
        if (event.type === HomieEventType.Property && event.property.id === propertyId) {
          expect(event.device.id).toBe(deviceId);
          expect(event.node.id).toBe(nodeId);
          expect(event.property.id).toBe(propertyId);
          expect(event.property.value).toBe('initial-value');
          done();
        }
      },
      (error) => {
        console.error('Error in subscription:', error);
        done(error);
      }
    ));

    client.publish(`${homiePrefix}/${deviceId}/$state`, 'init', { qos: 1 }, () => {
      client.publish(`${homiePrefix}/${deviceId}/${nodeId}/$name`, 'Test Node', { qos: 1 }, () => {
        client.publish(`${homiePrefix}/${deviceId}/${nodeId}/${propertyId}`, 'initial-value', { qos: 1 }, () => {
          setTimeout(() => {
            client.publish(`${homiePrefix}/${deviceId}/${nodeId}/${propertyId}`, 'updated-value', { qos: 1 });
          }, 500);
        });
      });
    });
  });
});