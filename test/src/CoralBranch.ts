import { HomieNode } from '../../src/HomieNode';
import { HomieProperty } from '../../src/HomieProperty';

export class CoralBranch extends HomieNode {
  constructor(name: string) {
    super(name);
    this.addProperty(new HomieProperty('color', 'pink', 'string'));
    this.addProperty(new HomieProperty('length', 10, 'integer'));
  }

  // Add coral branch specific methods here
}