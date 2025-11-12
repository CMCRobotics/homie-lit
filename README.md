# Homie-Lit

**Homie-Lit** [ˈhoʊmi lɪt] is a TypeScript library that integrates Homie devices with DOM element attributes for easy visualization and interaction. It combines the Homie convention for IoT devices with the Lit library, an MQTT client and RXJS for creating fast, lightweight, reactive web components.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install Homie-Lit using npm:

```bash
npm install homie-lit
```

Or include it directly in your HTML file:

```html
<script src="https://cdn.jsdelivr.net/gh/cmcrobotics/homie-lit@main/dist/homie-lit.js"></script>
```

## Usage

Here's a basic example of how to use Homie-Lit to create a light bulb device with a switch:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Homie-Lit Demo: Light Switch and Light Bulb</title>
    <script src="https://cdn.jsdelivr.net/gh/cmcrobotics/homie-lit@main/dist/homie-lit.js"></script>
    <script type="module" src="lightBulb.js"></script>
</head>
<body>
    <h1>Homie-Lit Demo: Light Switch and Light Bulb</h1>
    <light-bulb-device id="myLightBulb"></light-bulb-device>
    <light-switch id="myLightSwitch"></light-switch>

    <script type="module">
        import { LightBulbDevice } from './lightBulb.js';

        const lightBulb = new LightBulbDevice('my-light', 'My Light Bulb');
        document.getElementById('myLightBulb').device = lightBulb;
        document.getElementById('myLightSwitch').device = lightBulb;
    </script>
</body>
</html>
```

## Using `homie-lit` with RxJS and TypeScript

The `homie-lit` library leverages RxJS to manage and observe MQTT property updates in real-time. This section provides a guide on how to use `HomiePropertyBuffer` to effectively handle these updates in your TypeScript projects.

### Setting Up the `HomiePropertyBuffer`

To get started, you need to create a `HomieObserver` instance using the `createMqttHomieObserver` factory function. This function connects to your MQTT broker and sets up the observer to listen for Homie device messages. Then, you can instantiate a `HomiePropertyBuffer` to buffer and process property updates.

```typescript
import { createMqttHomieObserver } from './HomieObserver';
import { HomiePropertyBuffer } from './HomiePropertyBuffer';

// Create an observer connected to an MQTT broker
const observer = createMqttHomieObserver('mqtt://your-broker-address');

// Subscribe to all properties of a device
observer.subscribe('my-device/#');

const propertyBuffer = new HomiePropertyBuffer(observer, 100); // Buffer interval of 100ms
```

### Subscribing to Property Updates

You can subscribe to the buffered updates using the `getBufferedUpdates()` method, which returns an RxJS Observable. This allows you to react to property changes as they are emitted.

```typescript
propertyBuffer.getBufferedUpdates().subscribe(updates => {
  console.log('Received updates:', updates);
  // Handle the updates in your application
});
```

### Prioritizing and Grouping Properties

`HomiePropertyBuffer` allows you to group properties and assign priorities to them. This is useful when you want to ensure that certain high-priority updates are processed before others.

```typescript
// Define property groups with different priorities
propertyBuffer.addPropertyGroup({ 
  name: 'High Priority', 
  properties: ['node1/prop1'], 
  priority: 2 
});
propertyBuffer.addPropertyGroup({ 
  name: 'Low Priority', 
  properties: ['node1/prop2'], 
  priority: 1 
});

// Updates for 'prop1' will be emitted before updates for 'prop2'
```

This setup ensures that property updates are handled efficiently and in the desired order, making your application more robust and responsive.

### Observing Connection Events

You can also observe the connection and disconnection events from the MQTT broker. This is useful for handling connection state changes in your application.

```typescript
// Subscribe to connection events
observer.connected$.subscribe(() => {
  console.log('Connected to MQTT broker');
});

// Subscribe to disconnection events
observer.disconnected$.subscribe(() => {
  console.log('Disconnected from MQTT broker');
});
```

## Examples

You can find more examples in the `demo*` directories of this repository. These examples demonstrate various use cases and features of Homie-Lit.

## API Reference

### HomieDevice

The main class for creating a Homie device.

```typescript
class HomieDevice {
  constructor(id: string, name: string);
  addNode(node: HomieNode): void;
  getNode(id: string): HomieNode | undefined;
  getAllNodes(): HomieNode[];
}
```

### HomieNode

Represents a node in the Homie device.

```typescript
class HomieNode {
  constructor(id: string, name: string, type: string);
  addProperty(property: HomieProperty): void;
  getProperty(id: string): HomieProperty | undefined;
}
```

### HomieProperty

Represents a property of a Homie node.

```typescript
class HomieProperty {
  constructor(id: string, name: string, datatype: string);
  setValue(value: any): void;
  getValue(): any;
}
```

### HomieDeviceElement

A custom element for rendering Homie devices.

```typescript
class HomieDeviceElement extends LitElement {
  device: HomieDevice;
}
```

For more detailed API documentation, please refer to the source code and comments.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.
