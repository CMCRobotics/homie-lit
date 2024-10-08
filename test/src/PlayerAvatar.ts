import { HomieNode } from '../../src/HomieNode';
import { HomieProperty } from '../../src/HomieProperty';

export class PlayerAvatar extends HomieNode {
  constructor(name: string) {
    super(name);
    this.addProperty(new HomieProperty('position', "Position", { x: 0, y: 0, z: 0 }, 'json'));
    this.addProperty(new HomieProperty('rotation', "Rotation", { x: 0, y: 0, z: 0 }, 'json'));
  }

  // Add player avatar specific methods here
}