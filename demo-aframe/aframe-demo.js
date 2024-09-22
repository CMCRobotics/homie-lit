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

    // Listen for property changes
    // this.stateProperty.on('value', (value) => this.updateBulbState(value));

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

