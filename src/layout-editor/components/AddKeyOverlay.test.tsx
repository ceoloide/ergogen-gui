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
        spread: 19.05,
        stagger: 0,
        splay: 0,
        splayOrigin: [0, 0],
        ergogenProps: {},
      },
      {
        name: 'col2',
        spread: 19.05,
        stagger: 0,
        splay: 0,
        splayOrigin: [0, 0],
        ergogenProps: {},
      },
    ],
    rows: [
      { name: 'row1', ergogenProps: {} },
      { name: 'row2', ergogenProps: {} },
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
      // Arrange
      render(<AddKeyOverlay {...defaultProps} />);

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
      // Arrange
      render(<AddKeyOverlay {...defaultProps} />);

      // Act
      fireEvent.click(screen.getByTestId('add-key-down'));

      // Assert
      expect(defaultProps.onDirectionClick).toHaveBeenCalledWith('down');
    });

    it('should call onDirectionClick with "left" when left button is clicked', () => {
      // Arrange
      render(<AddKeyOverlay {...defaultProps} />);

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
    it('should disable "up" button when there is a key above', () => {
      // Arrange
      const keyAbove = createTestKey({
        id: 'key-above',
        row: 'row1',
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
      const zone = createTestZone();

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
          zone={zone}
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
      const zone = createTestZone();

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
          zone={zone}
        />
      );

      // Assert
      const rightButton = screen.getByTestId('add-key-right');
      expect(rightButton).toBeDisabled();
    });

    it('should not call onDirectionClick when clicking disabled button', () => {
      // Arrange
      const keyAbove = createTestKey({
        id: 'key-above',
        row: 'row1',
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

      // Act
      fireEvent.click(screen.getByTestId('add-key-up'));

      // Assert
      expect(defaultProps.onDirectionClick).not.toHaveBeenCalled();
    });

    it('should enable all buttons when no adjacent keys exist', () => {
      // Arrange - single key with no neighbors
      const selectedKey = createTestKey();
      const allKeys = new Map([['test-key-1', selectedKey]]);
      const zone = createTestZone();

      render(
        <AddKeyOverlay
          {...defaultProps}
          selectedKey={selectedKey}
          allKeys={allKeys}
          zone={zone}
        />
      );

      // Assert
      expect(screen.getByTestId('add-key-up')).not.toBeDisabled();
      expect(screen.getByTestId('add-key-down')).not.toBeDisabled();
      expect(screen.getByTestId('add-key-left')).not.toBeDisabled();
      expect(screen.getByTestId('add-key-right')).not.toBeDisabled();
    });
  });

  describe('no zone', () => {
    it('should check for adjacent keys by position when no zone', () => {
      // Arrange
      const keyRight = createTestKey({
        id: 'key-right',
        x: 1,
        y: 0,
      });
      const selectedKey = createTestKey({
        id: 'selected-key',
        x: 0,
        y: 0,
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

      // Assert - right should be disabled because there's a key at x+1
      const rightButton = screen.getByTestId('add-key-right');
      expect(rightButton).toBeDisabled();
    });
  });
});
