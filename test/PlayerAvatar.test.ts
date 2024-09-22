import { PlayerAvatar } from './src/PlayerAvatar';

describe('PlayerAvatar', () => {
  let playerAvatar: PlayerAvatar;

  beforeEach(() => {
    playerAvatar = new PlayerAvatar('testPlayer');
  });

  test('should be created with correct name', () => {
    expect(playerAvatar.name).toBe('testPlayer');
  });

  test('should have position property', () => {
    const positionProperty = playerAvatar.getProperty('position');
    expect(positionProperty).toBeDefined();
    expect(positionProperty?.value).toEqual({ x: 0, y: 0, z: 0 });
  });

  test('should have rotation property', () => {
    const rotationProperty = playerAvatar.getProperty('rotation');
    expect(rotationProperty).toBeDefined();
    expect(rotationProperty?.value).toEqual({ x: 0, y: 0, z: 0 });
  });
});