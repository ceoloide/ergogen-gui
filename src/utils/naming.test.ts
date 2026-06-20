import { getNextDefaultName } from './naming';

describe('getNextDefaultName', () => {
  it('should start with 1 if no existing names match', () => {
    expect(getNextDefaultName('Untitled', [])).toBe('Untitled 1');
    expect(getNextDefaultName('Untitled', ['Other 1'])).toBe('Untitled 1');
  });

  it('should increment based on the highest number', () => {
    expect(getNextDefaultName('Untitled', ['Untitled 1'])).toBe('Untitled 2');
    expect(getNextDefaultName('Untitled', ['Untitled 1', 'Untitled 3'])).toBe('Untitled 4');
    expect(getNextDefaultName('Untitled', ['Untitled 1', 'Untitled 10'])).toBe('Untitled 11');
  });

  it('should handle multiple prefixes independently', () => {
    const existing = ['Untitled 1', 'Shared 1', 'Shared 5'];
    expect(getNextDefaultName('Untitled', existing)).toBe('Untitled 2');
    expect(getNextDefaultName('Shared', existing)).toBe('Shared 6');
  });
});
