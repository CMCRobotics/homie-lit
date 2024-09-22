import { HomieDeviceElement } from './HomieDeviceElement';

import { CoralReef } from './CoralReef';


const coralReef = new CoralReef('My Coral Reef');
const deviceElement = new HomieDeviceElement();
deviceElement.device = coralReef;

document.getElementById('app')?.appendChild(deviceElement);
