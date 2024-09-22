import { HomieDevice } from './HomieDevice';
import { CoralBranch } from './CoralBranch';

export class CoralReef extends HomieDevice {
  constructor(name: string) {
    super(name);
    this.addNode(new CoralBranch('branch1'));
    this.addNode(new CoralBranch('branch2'));
  }

  // Add coral reef specific methods here
}