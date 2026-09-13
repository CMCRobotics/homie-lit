// This is a conceptual refactoring of the aframe-demo.js using the new binding manager
import { initHomieBinding } from '@cmcrobotics/homie-lit-aframe';
import { createMqttHomieObserver } from '@cmcrobotics/homie-lit';

// 1. Initialize Observer and Binding Manager
const observer = createMqttHomieObserver("ws://localhost:9001");
const bindingManager = initHomieBinding(observer);

// 2. INJECT CUSTOM TRANSFORMER
// Example: Parse an accelerometer JSON {x, y, z} and return an A-Frame rotation string
bindingManager.registerTransformer('accelToRotation', (val) => {
  try {
    const data = typeof val === 'string' ? JSON.parse(val) : val;
    // Map accelerometer values to degrees
    return `${data.x * 90} ${data.y * 90} ${data.z * 90}`;
  } catch (e) {
    return '0 0 0';
  }
});

// 3. Original complex component simplified
AFRAME.registerComponent('homie-light-bulb-v2', {
  init: function () {
    // We no longer need to create HomieDevice/Node/Property manually here
    // for simple display purposes if they already exist in the MQTT network.
    
    // Create bulb geometry
    const bulbEl = document.createElement('a-sphere');
    bulbEl.setAttribute('radius', '0.1');
    bulbEl.setAttribute('color', '#808080'); // Initial off color
    
    // DECLARATIVE BINDING (via code or HTML)
    // Instead of manual updated$.subscribe, we just bind:
    bulbEl.setAttribute('homie-bind', {
      property: 'light-bulb/bulb/state',
      targetAttr: 'visible'
    });

    // BINDING WITH PLUGGABLE TRANSFORMER
    const accelEl = document.createElement('a-box');
    accelEl.setAttribute('homie-bind', {
      property: 'sensor/accel/data',
      targetAttr: 'rotation',
      transformer: 'accelToRotation' // Using the injected transformer!
    });

    this.el.appendChild(bulbEl);
    this.el.appendChild(accelEl);
  }
});

/* 
  In HTML, it would now look like this:
  
  <a-box
    homie-bind="property: sensor/accel/data; targetAttr: rotation; transformer: accelToRotation"
  ></a-box>

  The "accelToRotation" logic is defined once and can be reused anywhere in the HTML.
*/
