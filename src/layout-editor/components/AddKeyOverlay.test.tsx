/**
 * Tests for AddKeyOverlay component and helper functions.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddKeyOverlay } from './AddKeyOverlay';
import { EditorKey, EditorZone, DEFAULT_KEY, DEFAULT_ZONE } from '../types';

// Mock the theme
jest.mock('../../theme/theme', () => ({
  theme: {
    colors: {
      accent: '#28a745',
      accentDark: '#1e7b34',
      backgroundLighter: '#3c3c3c',
      textDarkest: '#999',
      white: '#fff',
    },
  },
}));

describe('AddKeyOverlay', () => {
  // Helper to create a test key
  const createTestKey = (overrides: Partial<EditorKey> = {}): EditorKey => ({
    ...DEFAULT_KEY,
    id: 'test-key-1',
    name: 'test_key',
    x: 0,
    y: 0,
    zone: 'matrix',
    column: 'col1',
    row: 'row1',
    ...overrides,
  });

  // Helper to create a test zone
  const createTestZone = (overrides: Partial<EditorZone> = {}): EditorZone => ({
    ...DEFAULT_ZONE,
    name: 'matrix',
    columns: [
      {
        name: 'col1',
        key: {
          spread: 19.05,
          stagger: 0,
          splay: 0,
          origin: [0, 0],
        },
        rows: {},
      },
      {
        name: 'col2',
        key: {
          spread: 19.05,
          stagger: 0,
          splay: 0,
          origin: [0, 0],
        },
        rows: {},
      },
    ],
    rows: [
      { name: 'row1', key: {} },
      { name: 'row2', key: {} },
    ],
    ...overrides,
  });

  const defaultProps = {
    selectedKey: createTestKey(),
    zone: createTestZone(),
    allKeys: new Map([['test-key-1', createTestKey()]]),
    zoom: 1,
    panX: 0,
    panY: 0,
    canvasWidth: 800,
    canvasHeight: 600,
    onDirectionClick: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render all four direction buttons', () => {
      // Arrange
      render(<AddKeyOverlay {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('add-key-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('add-key-up')).toBeInTheDocument();
      expect(screen.getByTestId('add-key-down')).toBeInTheDocument();
      expect(screen.getByTestId('add-key-left')).toBeInTheDocument();
      expect(screen.getByTestId('add-key-right')).toBeInTheDocument();
    });

    it('should render direction buttons with correct aria labels', () => {
      // Arrange - use a key at row2, col2 so all directions are enabled
      const selectedKey = createTestKey({
        id: 'selected-key',
        row: 'row2',
        column: 'col2',
      });
      const allKeys = new Map([['selected-key', selectedKey]]);

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
        />
      );

      // Assert
      expect(screen.getByLabelText('Add key up')).toBeInTheDocument();
      expect(screen.getByLabelText('Add key down')).toBeInTheDocument();
      expect(screen.getByLabelText('Add key left')).toBeInTheDocument();
      expect(screen.getByLabelText('Add key right')).toBeInTheDocument();
    });
  });

  describe('direction click handling', () => {
    it('should call onDirectionClick with "up" when up button is clicked', () => {
      // Arrange
      render(<AddKeyOverlay {...defaultProps} />);

      // Act
      fireEvent.click(screen.getByTestId('add-key-up'));

      // Assert
      expect(defaultProps.onDirectionClick).toHaveBeenCalledWith('up');
    });

    it('should call onDirectionClick with "down" when down button is clicked', () => {
      // Arrange - use a key at row2 so down is enabled
      const selectedKey = createTestKey({
        id: 'selected-key',
        row: 'row2',
        column: 'col1',
      });
      const allKeys = new Map([['selected-key', selectedKey]]);

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
        />
      );

      // Act
      fireEvent.click(screen.getByTestId('add-key-down'));

      // Assert
      expect(defaultProps.onDirectionClick).toHaveBeenCalledWith('down');
    });

    it('should call onDirectionClick with "left" when left button is clicked', () => {
      // Arrange - use a key at col2 so left is enabled
      const selectedKey = createTestKey({
        id: 'selected-key',
        row: 'row1',
        column: 'col2',
      });
      const allKeys = new Map([['selected-key', selectedKey]]);

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
        />
      );

      // Act
      fireEvent.click(screen.getByTestId('add-key-left'));

      // Assert
      expect(defaultProps.onDirectionClick).toHaveBeenCalledWith('left');
    });

    it('should call onDirectionClick with "right" when right button is clicked', () => {
      // Arrange
      render(<AddKeyOverlay {...defaultProps} />);

      // Act
      fireEvent.click(screen.getByTestId('add-key-right'));

      // Assert
      expect(defaultProps.onDirectionClick).toHaveBeenCalledWith('right');
    });
  });

  describe('blocked directions', () => {
    it('should disable "down" button when row is 1', () => {
      // Arrange - key at row1 cannot go down
      const selectedKey = createTestKey({
        id: 'selected-key',
        row: 'row1',
        column: 'col1',
      });
      const allKeys = new Map([['selected-key', selectedKey]]);

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
        />
      );

      // Assert
      const downButton = screen.getByTestId('add-key-down');
      expect(downButton).toBeDisabled();
    });

    it('should disable "left" button when column is 1', () => {
      // Arrange - key at col1 cannot go left
      const selectedKey = createTestKey({
        id: 'selected-key',
        row: 'row1',
        column: 'col1',
      });
      const allKeys = new Map([['selected-key', selectedKey]]);

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
        />
      );

      // Assert
      const leftButton = screen.getByTestId('add-key-left');
      expect(leftButton).toBeDisabled();
    });

    it('should disable "up" button when there is a key above (higher row number)', () => {
      // Arrange - key at row2, another key at row3 (above)
      const keyAbove = createTestKey({
        id: 'key-above',
        row: 'row3',
        column: 'col1',
      });
      const selectedKey = createTestKey({
        id: 'selected-key',
        row: 'row2',
        column: 'col1',
      });
      const allKeys = new Map([
        ['key-above', keyAbove],
        ['selected-key', selectedKey],
      ]);

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
        />
      );

      // Assert
      const upButton = screen.getByTestId('add-key-up');
      expect(upButton).toBeDisabled();
    });

    it('should disable "right" button when there is a key to the right', () => {
      // Arrange
      const keyRight = createTestKey({
        id: 'key-right',
        row: 'row1',
        column: 'col2',
      });
      const selectedKey = createTestKey({
        id: 'selected-key',
        row: 'row1',
        column: 'col1',
      });
      const allKeys = new Map([
        ['key-right', keyRight],
        ['selected-key', selectedKey],
      ]);

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
        />
      );

      // Assert
      const rightButton = screen.getByTestId('add-key-right');
      expect(rightButton).toBeDisabled();
    });

    it('should not call onDirectionClick when clicking disabled button', () => {
      // Arrange - key at row1, col1 - down and left are disabled
      const selectedKey = createTestKey({
        id: 'selected-key',
        row: 'row1',
        column: 'col1',
      });
      const allKeys = new Map([['selected-key', selectedKey]]);

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
        />
      );

      // Act - try to click disabled down button
      fireEvent.click(screen.getByTestId('add-key-down'));

      // Assert
      expect(defaultProps.onDirectionClick).not.toHaveBeenCalled();
    });

    it('should enable down button when row > 1 and no key below', () => {
      // Arrange - key at row2 can go down
      const selectedKey = createTestKey({
        id: 'selected-key',
        row: 'row2',
        column: 'col1',
      });
      const allKeys = new Map([['selected-key', selectedKey]]);

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
        />
      );

      // Assert
      expect(screen.getByTestId('add-key-down')).not.toBeDisabled();
    });

    it('should enable left button when column > 1 and no key to the left', () => {
      // Arrange - key at col2 can go left
      const selectedKey = createTestKey({
        id: 'selected-key',
        row: 'row1',
        column: 'col2',
      });
      const allKeys = new Map([['selected-key', selectedKey]]);

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
        />
      );

      // Assert
      expect(screen.getByTestId('add-key-left')).not.toBeDisabled();
    });

    it('should enable up and right buttons for key at row1, col1', () => {
      // Arrange - single key with no neighbors at row1, col1
      const selectedKey = createTestKey();
      const allKeys = new Map([['test-key-1', selectedKey]]);

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
        />
      );

      // Assert - up and right should be enabled, down and left disabled
      expect(screen.getByTestId('add-key-up')).not.toBeDisabled();
      expect(screen.getByTestId('add-key-right')).not.toBeDisabled();
      expect(screen.getByTestId('add-key-down')).toBeDisabled();
      expect(screen.getByTestId('add-key-left')).toBeDisabled();
    });
  });

  describe('no zone', () => {
    it('should still block based on column/row names even without zone', () => {
      // Arrange - key at col1, row1 with another at col2, row1
      const keyRight = createTestKey({
        id: 'key-right',
        column: 'col2',
        row: 'row1',
      });
      const selectedKey = createTestKey({
        id: 'selected-key',
        column: 'col1',
        row: 'row1',
      });
      const allKeys = new Map([
        ['key-right', keyRight],
        ['selected-key', selectedKey],
      ]);

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
          zone={null}
        />
      );

      // Assert - right should be disabled because there's a key at col2
      const rightButton = screen.getByTestId('add-key-right');
      expect(rightButton).toBeDisabled();
      // Down and left should also be disabled (at row1, col1)
      expect(screen.getByTestId('add-key-down')).toBeDisabled();
      expect(screen.getByTestId('add-key-left')).toBeDisabled();
    });
  });
});
