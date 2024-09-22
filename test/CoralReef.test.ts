import { CoralReef } from './src/CoralReef';
import { CoralBranch } from './src/CoralBranch';

describe('CoralReef', () => {
  let coralReef: CoralReef;

  beforeEach(() => {
    coralReef = new CoralReef('testReef');
  });

  test('should be created with correct name', () => {
    expect(coralReef.name).toBe('testReef');
  });

  test('should have two coral branches', () => {
    const branch1 = coralReef.getNode('branch1');
    const branch2 = coralReef.getNode('branch2');
    expect(branch1).toBeInstanceOf(CoralBranch);
    expect(branch2).toBeInstanceOf(CoralBranch);
  });

  test('should have correct branch names', () => {
    const branch1 = coralReef.getNode('branch1');
    const branch2 = coralReef.getNode('branch2');
    expect(branch1?.name).toBe('branch1');
    expect(branch2?.name).toBe('branch2');
  });
});