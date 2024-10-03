import { HomieObserver, HomieEventType, createMqttHomieObserver } from '../src/HomieObserver';
import * as mqtt from 'mqtt';
import { Subscription } from 'rxjs';
import * as dotenv from 'dotenv';
dotenv.config();

describe('HomieObserver Simple Integration Test', () => {
  let observer: HomieObserver;
  let client: mqtt.Client;
  let homiePrefix: string;
  let subscriptions: Subscription[] = [];

  beforeEach((done) => {
    homiePrefix = `test-homie-${Math.random().toString(36).substring(7)}`;
    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost';
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

    // Subscribe to the Homie device topic using the new subscribe method
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

      // Wait a short time to ensure the message is processed
      setTimeout(() => {
        if (!eventReceived) {
          done(new Error('Event not received within timeout'));
        } else {
          expect(eventReceived).toBe(true);
          done();
        }
      }, 300);
    });
  });
});