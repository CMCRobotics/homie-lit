import * as mqtt from 'mqtt';

describe('MQTT Homie Sanity Test', () => {
  let client: mqtt.Client;
  const brokerUrl = 'mqtt://localhost';
  const homiePrefix = `test-homie-${Math.random().toString(36).substring(7)}`;
  const deviceId = 'test-device';

  beforeAll((done) => {
    client = mqtt.connect(brokerUrl);
    client.on('connect', () => {
      done();
    });
  });

  afterAll((done) => {
    if (client.connected) {
      client.end(false, {}, () => {
        done();
      });
    } else {
      done();
    }
  });

  test('should create a device and receive an update', (done) => {
    const deviceTopic = `${homiePrefix}/${deviceId}`;
    let messageReceived = false;

    const cleanupAndDone = (error?: Error) => {
      client.unsubscribe(`${deviceTopic}/#`, () => {
        client.removeAllListeners('message');
        if (error) {
          done(error);
        } else {
          done();
        }
      });
    };

    // Subscribe to device updates
    client.subscribe(`${deviceTopic}/#`, undefined, (err) => {
      if (err) {
        cleanupAndDone(err);
        return;
      }

      // Publish device state
      client.publish(`${deviceTopic}/$state`, 'ready', { retain: true }, (err) => {
        if (err) {
          cleanupAndDone(err);
          return;
        }
      });
    });

    // Listen for messages
    client.on('message', (topic, message) => {
      if (topic === `${deviceTopic}/$state` && message.toString() === 'ready') {
        messageReceived = true;
        expect(messageReceived).toBe(true);
        cleanupAndDone();
      }
    });

    // Set a timeout in case we don't receive the message
    const timeoutId = setTimeout(() => {
      cleanupAndDone(new Error('Timeout: Did not receive device update message'));
    }, 5000);

    // Clear the timeout if the test completes successfully
    client.on('message', () => {
      clearTimeout(timeoutId);
    });
  });
});