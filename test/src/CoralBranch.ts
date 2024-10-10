import { HomieNode } from '../../src/HomieNode';
import { HomieProperty } from '../../src/HomieProperty';

export class CoralBranch extends HomieNode {
  constructor(name: string) {
    super(name);
    this.addProperty(new HomieProperty('color', 'Color',  'pink', 'string'));
    this.addProperty(new HomieProperty('length', 'Length', 10, 'integer'));
  }

  // Add coral branch specific methods here
}