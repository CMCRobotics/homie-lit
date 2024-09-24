const { HomieObserver, HomieEventType, createMqttHomieObserver } = HomieLit;

// Wait for A-Frame to be ready
AFRAME.registerComponent('homie-light-switch', {
  init: function () {
    const { HomieDevice, HomieNode, HomieProperty } = HomieLit;

    // Create Homie device for the light switch
    this.device = new HomieDevice('light-switch', 'Light Switch');
    const node = new HomieNode('switch', 'Switch', 'switch');
    this.device.addNode(node);
    this.stateProperty = new HomieProperty('state', 'State', 'boolean');
    node.addProperty(this.stateProperty);

    // Create switch geometry
    const switchEl = document.createElement('a-box');
    switchEl.setAttribute('color', '#4CC3D9');
    switchEl.setAttribute('depth', '0.1');
    switchEl.setAttribute('height', '0.2');
    switchEl.setAttribute('width', '0.1');
    this.el.appendChild(switchEl);

    // Add interactivity
    this.el.addEventListener('click', () => this.toggleSwitch());

    // Initialize switch state
    this.switchState = false;
    this.updateSwitchVisual();
  },

  toggleSwitch: function () {
    this.switchState = !this.switchState;
    this.stateProperty.setValue(this.switchState);
    this.updateSwitchVisual();
  },

  updateSwitchVisual: function () {
    const switchEl = this.el.querySelector('a-box');
    switchEl.setAttribute('color', `${this.switchState ? '#4CC3D9' : '#4C03D9'}`);
    switchEl.setAttribute('rotation', `0 ${this.switchState ? '30' : '-30'} 0`);
  }
});

AFRAME.registerComponent('homie-light-bulb', {
  init: function () {
    const { HomieDevice, HomieNode, HomieProperty } = HomieLit;

    // Create Homie device for the light bulb
    this.device = new HomieDevice('light-bulb', 'Light Bulb');
    const node = new HomieNode('bulb', 'Bulb', 'light');
    this.device.addNode(node);
    this.stateProperty = new HomieProperty('state', 'State', 'boolean');
    node.addProperty(this.stateProperty);

    // Create bulb geometry
    const bulbEl = document.createElement('a-sphere');
    bulbEl.setAttribute('radius', '0.1');
    bulbEl.setAttribute('color', '#FFF');
    this.el.appendChild(bulbEl);

    // Initialize bulb state
    this.updateBulbState(false);
  },

  updateBulbState: function (isOn) {
    const bulbEl = this.el.querySelector('a-sphere');
    bulbEl.setAttribute('material', {
      color: isOn ? '#FFFF00' : '#808080',
      emissive: isOn ? '#FFFF00' : '#000000',
      emissiveIntensity: isOn ? 0.5 : 0
    });

    // Add or remove light component
    if (isOn) {
      this.el.setAttribute('light', {
        type: 'point',
        color: '#FFFF00',
        intensity: 0.5,
        distance: 5
      });
    } else {
      this.el.removeAttribute('light');
    }
  }
});

// Connect HomieObserver to MQTT broker
observer = createMqttHomieObserver("ws://localhost:9001");

observer.updated$.subscribe(
  (event) => {
    if (event.type == 'property') {
      if (event.device.id === 'switch' && event.node.id === 'switch' && event.property.id === 'state') {
        document.getElementById('switch-state').textContent = `Switch State: ${event.property.value}`;
        const switchComponent = document.querySelector('[homie-light-switch]').components["homie-light-switch"];
        switchComponent.toggleSwitch();
        switchComponent.updateSwitchVisual();
        const bulbComponent = document.querySelector('[homie-light-bulb]').components["homie-light-bulb"];
        bulbComponent.updateBulbState(event.property.value=='true');
      } 
      // else if (event.device.id === 'bulb' && event.node.id === 'bulb' && event.property.id === 'state') {
      //   document.getElementById('bulb-state').textContent = `Bulb State: ${event.property.value}`;
      //   // Update the bulb entity in A-Frame
      //   const bulbComponent = document.querySelector('[homie-light-bulb]').components["homie-light-bulb"];
      //   bulbComponent.updateBulbState(event.property.value=='true');
      // }
    }
  },
  (error) => {
    console.error('Error in subscription:', error);
    done(error);
  }
);


observer.subscribe('switch/switch/state');
// observer.subscribe('bulb/bulb/state');

