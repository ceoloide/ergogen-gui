import { render, screen, fireEvent } from '@testing-library/react';
import GenOption from './GenOption';

describe('GenOption', () => {
  const defaultProps = {
    optionId: 'test-option',
    label: 'Test Option',
    checked: false,
    setSelected: jest.fn(),
  };

  it('renders the label correctly', () => {
    render(<GenOption {...defaultProps} />);
    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });

  it('renders with React node as label', () => {
    render(
      <GenOption
        {...defaultProps}
        label={<span data-testid="custom-label">Custom Label</span>}
      />
    );
    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('reflects the checked state (false)', () => {
    render(<GenOption {...defaultProps} checked={false} />);
    const checkbox = screen.getByTestId(
      'option-test-option'
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('reflects the checked state (true)', () => {
    render(<GenOption {...defaultProps} checked={true} />);
    const checkbox = screen.getByTestId(
      'option-test-option'
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('calls setSelected when clicked', () => {
    const setSelected = jest.fn();
    render(<GenOption {...defaultProps} setSelected={setSelected} />);

    const checkbox = screen.getByTestId('option-test-option');
    fireEvent.click(checkbox);

    expect(setSelected).toHaveBeenCalledWith(true);
  });

  it('calls setSelected with false when currently checked and clicked', () => {
    const setSelected = jest.fn();
    render(
      <GenOption {...defaultProps} checked={true} setSelected={setSelected} />
    );

    const checkbox = screen.getByTestId('option-test-option');
    fireEvent.click(checkbox);

    expect(setSelected).toHaveBeenCalledWith(false);
  });

  it('applies aria-label to the input', () => {
    render(<GenOption {...defaultProps} aria-label="Custom Aria Label" />);
    const checkbox = screen.getByLabelText('Custom Aria Label');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('id', 'test-option');
  });

  it('associates label with input using htmlFor', () => {
    render(<GenOption {...defaultProps} />);
    const label = screen.getByText('Test Option');
    expect(label).toHaveAttribute('for', 'test-option');
  });
});
