import {
  mergeInjectionArrays,
  getInjectionConflicts,
  mergeInjectionArraysWithResolution,
} from './injections';

describe('injections utilities', () => {
  describe('mergeInjectionArrays', () => {
    it('adds new injections when no conflicts exist', () => {
      // Arrange
      const newInjections = [
        ['footprint', 'footprint1', 'content1'],
        ['template', 'template1', 'content1'],
      ];
      const existingInjections: string[][] = [];

      // Act
      const result = mergeInjectionArrays(newInjections, existingInjections);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(['footprint', 'footprint1', 'content1']);
      expect(result[1]).toEqual(['template', 'template1', 'content1']);
    });

    it('adds new injections when existing injections are undefined', () => {
      // Arrange
      const newInjections = [['footprint', 'footprint1', 'content1']];

      // Act
      const result = mergeInjectionArrays(newInjections, undefined);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(['footprint', 'footprint1', 'content1']);
    });

    it('overwrites existing injections with same type and name', () => {
      // Arrange
      const newInjections = [
        ['footprint', 'existing', 'new_content'],
        ['template', 'existing_template', 'new_template_content'],
      ];
      const existingInjections = [
        ['footprint', 'existing', 'old_content'],
        ['template', 'existing_template', 'old_template_content'],
        ['footprint', 'other', 'other_content'],
      ];

      // Act
      const result = mergeInjectionArrays(newInjections, existingInjections);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(['footprint', 'existing', 'new_content']);
      expect(result[1]).toEqual([
        'template',
        'existing_template',
        'new_template_content',
      ]);
      expect(result[2]).toEqual(['footprint', 'other', 'other_content']);
    });

    it('keeps existing injections not present in new array', () => {
      // Arrange
      const newInjections = [['footprint', 'new_one', 'new_content']];
      const existingInjections = [
        ['footprint', 'existing', 'old_content'],
        ['template', 'existing_template', 'template_content'],
      ];

      // Act
      const result = mergeInjectionArrays(newInjections, existingInjections);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(['footprint', 'existing', 'old_content']);
      expect(result[1]).toEqual([
        'template',
        'existing_template',
        'template_content',
      ]);
      expect(result[2]).toEqual(['footprint', 'new_one', 'new_content']);
    });

    it('handles different injection types correctly', () => {
      // Arrange
      const newInjections = [
        ['footprint', 'shared_name', 'footprint_content'],
        ['template', 'shared_name', 'template_content'],
      ];
      const existingInjections = [
        ['footprint', 'shared_name', 'old_footprint'],
        ['template', 'shared_name', 'old_template'],
      ];

      // Act
      const result = mergeInjectionArrays(newInjections, existingInjections);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual([
        'footprint',
        'shared_name',
        'footprint_content',
      ]);
      expect(result[1]).toEqual([
        'template',
        'shared_name',
        'template_content',
      ]);
    });

    it('skips invalid injection formats', () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const newInjections = [
        ['footprint', 'valid', 'content'],
        ['invalid'], // wrong length
        ['footprint', 'name'], // wrong length
        ['footprint', 'valid2', 'content2'],
        null as unknown as string[], // not an array
        ['template', 123, 'content'] as unknown as string[], // wrong types
      ];
      const existingInjections: string[][] = [];

      // Act
      const result = mergeInjectionArrays(
        newInjections as string[][],
        existingInjections
      );

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(['footprint', 'valid', 'content']);
      expect(result[1]).toEqual(['footprint', 'valid2', 'content2']);
      expect(consoleSpy).toHaveBeenCalledTimes(4); // 4 invalid entries

      consoleSpy.mockRestore();
    });

    it('handles mixed overwrite and add scenarios', () => {
      // Arrange
      const newInjections = [
        ['footprint', 'existing1', 'new_content1'], // overwrite
        ['footprint', 'new_one', 'new_content'], // add
        ['template', 'existing_template', 'new_template'], // overwrite
      ];
      const existingInjections = [
        ['footprint', 'existing1', 'old_content1'],
        ['footprint', 'existing2', 'old_content2'], // keep
        ['template', 'existing_template', 'old_template'],
        ['template', 'other_template', 'other_content'], // keep
      ];

      // Act
      const result = mergeInjectionArrays(newInjections, existingInjections);

      // Assert
      expect(result).toHaveLength(5);
      // Check overwritten ones
      const existing1 = result.find((inj) => inj[1] === 'existing1');
      expect(existing1).toEqual(['footprint', 'existing1', 'new_content1']);
      const existingTemplate = result.find(
        (inj) => inj[1] === 'existing_template'
      );
      expect(existingTemplate).toEqual([
        'template',
        'existing_template',
        'new_template',
      ]);
      // Check kept ones
      const existing2 = result.find((inj) => inj[1] === 'existing2');
      expect(existing2).toEqual(['footprint', 'existing2', 'old_content2']);
      const otherTemplate = result.find((inj) => inj[1] === 'other_template');
      expect(otherTemplate).toEqual([
        'template',
        'other_template',
        'other_content',
      ]);
      // Check added one
      const newOne = result.find((inj) => inj[1] === 'new_one');
      expect(newOne).toEqual(['footprint', 'new_one', 'new_content']);
    });

    it.each([
      ['has four fields', ['footprint', 'switch', 'code', 'extra']],
      ['has a type that is not a string', [1, 'switch', 'code']],
      ['has content that is not a string', ['footprint', 'switch', 1]],
    ])('skips an injection that %s', (_, malformed) => {
      // Arrange
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const existingInjections = [['footprint', 'diode', 'code']];

      // Act
      const result = mergeInjectionArrays(
        [malformed as string[]],
        existingInjections
      );
      vi.restoreAllMocks();

      // Assert
      expect(result).toEqual([['footprint', 'diode', 'code']]);
    });

    it('adds an injection whose name only another type uses', () => {
      // Arrange
      const newInjections = [['template', 'shared_name', 'template_content']];
      const existingInjections = [['footprint', 'shared_name', 'footprint']];

      // Act
      const result = mergeInjectionArrays(newInjections, existingInjections);

      // Assert
      expect(result).toEqual([
        ['footprint', 'shared_name', 'footprint'],
        ['template', 'shared_name', 'template_content'],
      ]);
    });

    it('overwrites the injection with the same name, not the first of its type', () => {
      // Arrange
      const newInjections = [['footprint', 'diode', 'new_diode']];
      const existingInjections = [
        ['footprint', 'switch', 'switch'],
        ['footprint', 'diode', 'old_diode'],
      ];

      // Act
      const result = mergeInjectionArrays(newInjections, existingInjections);

      // Assert
      expect(result).toEqual([
        ['footprint', 'switch', 'switch'],
        ['footprint', 'diode', 'new_diode'],
      ]);
    });
  });

  describe('mergeInjectionArraysWithResolution', () => {
    it('keeps both injections on a conflict, with the new one under the next free number', () => {
      // Arrange
      const newInjections = [['footprint', 'diode', 'new_diode']];
      const existingInjections = [
        ['footprint', 'diode', 'old_diode'],
        ['footprint', 'diode_1', 'other_diode'],
      ];

      // Act
      const result = mergeInjectionArraysWithResolution(
        newInjections,
        existingInjections,
        'keep-both'
      );

      // Assert
      expect(result).toEqual([
        ['footprint', 'diode', 'old_diode'],
        ['footprint', 'diode_1', 'other_diode'],
        ['footprint', 'diode_2', 'new_diode'],
      ]);
    });
  });

  describe('getInjectionConflicts', () => {
    it('returns empty array when no conflicts exist', () => {
      // Arrange
      const newInjections = [
        ['footprint', 'new_footprint', 'content'],
        ['template', 'new_template', 'content'],
      ];
      const existingInjections = [
        ['footprint', 'existing_footprint', 'content'],
      ];

      // Act
      const result = getInjectionConflicts(newInjections, existingInjections);

      // Assert
      expect(result).toHaveLength(0);
    });

    it('returns conflicts when they exist', () => {
      // Arrange
      const newInjections = [
        ['footprint', 'existing_footprint', 'new_content'],
        ['template', 'existing_template', 'new_content'],
        ['footprint', 'new_footprint', 'content'],
      ];
      const existingInjections = [
        ['footprint', 'existing_footprint', 'old_content'],
        ['template', 'existing_template', 'old_content'],
      ];

      // Act
      const result = getInjectionConflicts(newInjections, existingInjections);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].injection).toEqual([
        'footprint',
        'existing_footprint',
        'new_content',
      ]);
      expect(result[0].conflict.hasConflict).toBe(true);
      expect(result[1].injection).toEqual([
        'template',
        'existing_template',
        'new_content',
      ]);
      expect(result[1].conflict.hasConflict).toBe(true);
    });

    it('returns no conflicts when there are no existing injections', () => {
      // Act
      const result = getInjectionConflicts(
        [['footprint', 'diode', 'code']],
        undefined
      );

      // Assert
      expect(result).toEqual([]);
    });

    it('reports no conflict for a name that only another type uses', () => {
      // Act
      const result = getInjectionConflicts(
        [['template', 'shared_name', 'code']],
        [['footprint', 'shared_name', 'code']]
      );

      // Assert
      expect(result).toEqual([]);
    });

    it('reports no conflict for a malformed new injection', () => {
      // Act
      const result = getInjectionConflicts(
        [['footprint', 'diode']],
        [['footprint', 'diode', 'code']]
      );

      // Assert
      expect(result).toEqual([]);
    });
  });
});
