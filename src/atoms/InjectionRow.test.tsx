import { render, screen, fireEvent } from '@testing-library/react';
import InjectionRow from './InjectionRow';

window.URL.createObjectURL = jest.fn();

const setup = (
  props: Partial<React.ComponentProps<typeof InjectionRow>> = {}
) => {
  const defaultProps: React.ComponentProps<typeof InjectionRow> = {
    injection: {
      key: 0,
      type: 'footprint',
      name: 'test-injection',
      content: 'test-content',
    },
    setInjectionToEdit: jest.fn(),
    deleteInjection: jest.fn(),
    previewKey: '',
  };
  return render(<InjectionRow {...defaultProps} {...props} />);
};

describe('InjectionRow', () => {
  it('renders the injection name', () => {
    // Arrange
    setup();

    // Act & Assert
    expect(screen.getByText('test-injection')).toBeInTheDocument();
  });

  it('calls deleteInjection when the delete link is clicked', () => {
    // Arrange
    const deleteInjection = jest.fn();
    const injection = {
      key: 0,
      type: 'footprint',
      name: 'test-injection',
      content: 'test-content',
    };
    setup({ deleteInjection, injection });

    // Act
    fireEvent.click(screen.getByRole('link', { name: /delete injection/i }));

    // Assert
    expect(deleteInjection).toHaveBeenCalledWith(injection);
  });

  it('calls setInjectionToEdit when the injection name is clicked', () => {
    // Arrange
    const setInjectionToEdit = jest.fn();
    const injection = {
      key: 0,
      type: 'footprint',
      name: 'test-injection',
      content: 'test-content',
    };
    setup({ setInjectionToEdit, injection });

    // Act
    fireEvent.click(screen.getByText('test-injection'));

    // Assert
    expect(setInjectionToEdit).toHaveBeenCalledWith(injection);
  });

  it('highlights the row when active', () => {
    // Arrange
    setup({ previewKey: 'test-injection' });

    // Act & Assert
    expect(screen.getByTestId('injection-name')).toHaveStyle(
      'border-bottom: 2px solid #28a745'
    );
  });

  it('does not highlight the row when inactive', () => {
    // Arrange
    setup({ previewKey: 'another-injection' });

    // Act & Assert
    expect(screen.getByTestId('injection-name')).not.toHaveStyle(
      'border-bottom: 2px solid #28a745'
    );
  });
});
