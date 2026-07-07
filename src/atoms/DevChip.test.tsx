import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DevChip } from './DevChip';
import { VersionInfo } from '../utils/version';

describe('DevChip', () => {
  const mockVersionInfo: VersionInfo = {
    label: 'ceoloide/ergogen#v4.3.0',
    url: 'https://github.com/ceoloide/ergogen/tree/v4.3.0',
    displayText: 'v4.3.0',
    isCustom: true,
    isTag: true,
    isHash: false,
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the DEV chip with beaker icon', () => {
    // Arrange & Act
    render(
      <DevChip versionInfo={mockVersionInfo} data-testid="test-dev-chip" />
    );

    // Assert
    const badge = screen.getByTestId('test-dev-chip-badge');
    expect(badge).toBeInTheDocument();
    expect(screen.getByText('science')).toBeInTheDocument();
    expect(screen.queryByText('DEV')).not.toBeInTheDocument();
  });

  it('displays the popover modal on hover and closes on mouse leave with delay', () => {
    // Arrange
    render(
      <DevChip versionInfo={mockVersionInfo} data-testid="test-dev-chip" />
    );
    const wrapper = screen.getByTestId('test-dev-chip');

    // Act (Hover in)
    fireEvent.mouseEnter(wrapper);

    // Assert popover is visible
    expect(screen.getByTestId('test-dev-chip-popover')).toBeInTheDocument();
    expect(screen.getByText('Custom Ergogen Version')).toBeInTheDocument();
    expect(
      screen.getByText(/running a custom version of Ergogen/)
    ).toBeInTheDocument();

    const link = screen.getByTestId('test-dev-chip-link');
    expect(link).toHaveAttribute('href', mockVersionInfo.url);
    expect(screen.getByText(mockVersionInfo.label)).toBeInTheDocument();

    // Act (Mouse leave wrapper)
    fireEvent.mouseLeave(wrapper);

    // Assert popover is still visible immediately (due to delay)
    expect(screen.getByTestId('test-dev-chip-popover')).toBeInTheDocument();

    // Act (Advance timers to trigger close)
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Assert popover is closed
    expect(
      screen.queryByTestId('test-dev-chip-popover')
    ).not.toBeInTheDocument();
  });

  it('toggles the popover modal on click', () => {
    // Arrange
    render(
      <DevChip versionInfo={mockVersionInfo} data-testid="test-dev-chip" />
    );
    const badge = screen.getByTestId('test-dev-chip-badge');

    // Act (Click to open)
    fireEvent.click(badge);

    // Assert popover is open
    expect(screen.getByTestId('test-dev-chip-popover')).toBeInTheDocument();

    // Act (Click to close)
    fireEvent.click(badge);

    // Assert popover is closed
    expect(
      screen.queryByTestId('test-dev-chip-popover')
    ).not.toBeInTheDocument();
  });

  it('closes popover on global click', () => {
    // Arrange
    render(
      <div>
        <div data-testid="outside-element">Outside</div>
        <DevChip versionInfo={mockVersionInfo} data-testid="test-dev-chip" />
      </div>
    );
    const badge = screen.getByTestId('test-dev-chip-badge');

    // Act (Click badge to open)
    fireEvent.click(badge);
    expect(screen.getByTestId('test-dev-chip-popover')).toBeInTheDocument();

    // Act (Click outside)
    fireEvent.click(screen.getByTestId('outside-element'));

    // Assert popover closes
    expect(
      screen.queryByTestId('test-dev-chip-popover')
    ).not.toBeInTheDocument();
  });
});
