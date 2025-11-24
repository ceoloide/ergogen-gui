import { renderHook, act } from '@testing-library/react';
import { useInjectionConflictResolution } from './useInjectionConflictResolution';

describe('useInjectionConflictResolution', () => {
  const mockSetInjectionInput = jest.fn();
  const mockSetConfigInput = jest.fn();
  const mockGenerateNow = jest.fn();
  const mockGetCurrentInjections = jest.fn();

  const defaultCallbacks = {
    setInjectionInput: mockSetInjectionInput,
    setConfigInput: mockSetConfigInput,
    generateNow: mockGenerateNow,
    getCurrentInjections: mockGetCurrentInjections,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentInjections.mockReturnValue([]);
  });

  it('should rename the new injection when keep-both is selected', async () => {
    // Arrange
    const existingInjections = [['footprint', 'fp1', 'content1']];
    mockGetCurrentInjections.mockReturnValue(existingInjections);

    const newInjections = [['footprint', 'fp1', 'content2']];
    const config = 'some: config';

    const { result } = renderHook(() =>
      useInjectionConflictResolution(defaultCallbacks)
    );

    // Act - Process injections
    await act(async () => {
      await result.current.processInjectionsWithConflictResolution(
        newInjections,
        config
      );
    });

    // Assert - Conflict detected
    expect(result.current.currentConflict).toEqual({
      name: 'fp1',
      type: 'footprint',
    });

    // Act - Resolve with keep-both
    await act(async () => {
      await result.current.handleConflictResolution('keep-both', false);
    });

    // Assert - Result should have renamed injection
    // Expected: [['footprint', 'fp1', 'content1'], ['footprint', 'fp1_1', 'content2']]
    // Buggy: [['footprint', 'fp1', 'content1'], ['footprint', 'fp1', 'content2']]
    const expectedInjections = [
      ['footprint', 'fp1', 'content1'],
      ['footprint', 'fp1_1', 'content2'],
    ];

    expect(mockSetInjectionInput).toHaveBeenCalledWith(expectedInjections);
  });
});
