import { CoralBranch } from './src/CoralBranch';

describe('CoralBranch', () => {
  let coralBranch: CoralBranch;

  beforeEach(() => {
    coralBranch = new CoralBranch('testBranch');
  });

  test('should be created with correct name', () => {
    expect(coralBranch.name).toBe('testBranch');
  });

  test('should have color property', () => {
    const colorProperty = coralBranch.getProperty('color');
    expect(colorProperty).toBeDefined();
    expect(colorProperty?.value).toBe('pink');
  });

  test('should have length property', () => {
    const lengthProperty = coralBranch.getProperty('length');
    expect(lengthProperty).toBeDefined();
    expect(lengthProperty?.value).toBe(10);
  });
});