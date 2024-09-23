import { HomieObserver, HomieEventType, createMqttHomieObserver } from '../src/HomieObserver';
import * as mqtt from 'mqtt';
import { Subscription } from 'rxjs';

describe('HomieObserver Simple Integration Test', () => {
  let observer: HomieObserver;
  let client: mqtt.Client;
  let homiePrefix: string;
  let subscriptions: Subscription[] = [];

  beforeEach((done) => {
    homiePrefix = `test-homie-${Math.random().toString(36).substring(7)}`;
    observer = createMqttHomieObserver('mqtt://localhost', { homiePrefix });
    client = mqtt.connect('mqtt://localhost');
    
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
          if ((observer as any).client && typeof (observer as any).client.end === 'function') {
            (observer as any).client.end(false, {}, done);
          } else if (typeof (observer as any).disconnect === 'function') {
            (observer as any).disconnect();
            done();
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

    // Subscribe to the Homie device topic
    const subscribeTopic = `${homiePrefix}/${deviceId}/#`;
    if (typeof (observer as any).subscribe === 'function') {
      (observer as any).subscribe(subscribeTopic);
    } else if ((observer as any).client && typeof (observer as any).client.subscribe === 'function') {
      (observer as any).client.subscribe(subscribeTopic, (err: any) => {
        if (err) {
          console.error('Failed to subscribe:', err);
          done(err);
        }
      });
    } else {
      done(new Error('Unable to subscribe to MQTT topic'));
      return;
    }

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
      }, 2000); // 2 seconds timeout
    });
  });
});