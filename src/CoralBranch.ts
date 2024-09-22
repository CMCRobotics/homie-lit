import { HomieNode } from './HomieNode';
import { HomieProperty } from './HomieProperty';

export class CoralBranch extends HomieNode {
  constructor(name: string) {
    super(name);
    this.addProperty(new HomieProperty('color', 'pink'));
    this.addProperty(new HomieProperty('length', 10));
  }

  // Add coral branch specific methods here
}