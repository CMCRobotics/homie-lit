// import './lightSwitch.js';
import { LightBulbDevice } from './lightBulb.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // Create a light bulb device
    const lightBulb = new LightBulbDevice('my-light', 'My Light Bulb');

    // Get the light-bulb-device element and set its device property
    const lightBulbElement = document.getElementById('myLightBulb');
    lightBulbElement.device = lightBulb;

    // Get the light-switch element and set its device property
    const lightSwitchElement = document.getElementById('myLightSwitch');
    lightSwitchElement.device = lightBulb;

    // Add event listener to update the light bulb when the switch state changes
    lightSwitchElement.addEventListener('state-changed', (event) => {
        lightBulbElement.requestUpdate();
    });
});