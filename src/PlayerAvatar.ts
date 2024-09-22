import { HomieNode } from './HomieNode';
import { HomieProperty } from './HomieProperty';

export class PlayerAvatar extends HomieNode {
  constructor(name: string) {
    super(name);
    this.addProperty(new HomieProperty('position', { x: 0, y: 0, z: 0 }));
    this.addProperty(new HomieProperty('rotation', { x: 0, y: 0, z: 0 }));
  }

  // Add player avatar specific methods here
}