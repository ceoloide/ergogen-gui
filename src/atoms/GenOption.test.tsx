import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GenOption from './GenOption';

describe('GenOption', () => {
  const defaultProps = {
    optionId: 'test-option',
    label: 'Test Option Title',
    checked: false,
    setSelected: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the option title/label', () => {
    render(<GenOption {...defaultProps} />);
    expect(screen.getByText('Test Option Title')).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    const props = {
      ...defaultProps,
      description: 'This is a test description for the option.',
    };
    render(<GenOption {...props} />);
    expect(
      screen.getByText('This is a test description for the option.')
    ).toBeInTheDocument();
  });

  it('triggers setSelected callback when clicked', () => {
    render(<GenOption {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(defaultProps.setSelected).toHaveBeenCalledWith(true);
  });

  it('reflects the checked status', () => {
    render(<GenOption {...defaultProps} checked={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
});
