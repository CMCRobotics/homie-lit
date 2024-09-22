# Homie-Lit

**Homie-Lit** [ˈhoʊmi lɪt] is a TypeScript library that integrates Homie devices with DOM element attributes for easy visualization and interaction. It combines the Homie convention for IoT devices with the Lit library for creating fast, lightweight web components.

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
<script src="https://cdn.jsdelivr.net/gh/bcopy/homie-lit@main/dist/homie-lit.js"></script>
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
    <script src="https://cdn.jsdelivr.net/gh/bcopy/homie-lit@main/dist/homie-lit.js"></script>
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

## Examples

You can find more examples in the `examples` directory of this repository. These examples demonstrate various use cases and features of Homie-Lit.

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