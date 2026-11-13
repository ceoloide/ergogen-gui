import { render, screen, fireEvent } from '@testing-library/react';
import InjectionRow from './InjectionRow';
import { theme } from '../theme/theme';

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
    setInjectionToEdit: vi.fn(),
    deleteInjection: vi.fn(),
    previewKey: '',
    'data-testid': 'injection-row',
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
    const deleteInjection = vi.fn();
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
    const setInjectionToEdit = vi.fn();
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
    expect(screen.getByTestId('injection-row-name')).toHaveStyle(
      `border-bottom: 2px solid ${theme.colors.accent}`
    );
  });

  it('does not highlight the row when inactive', () => {
    // Arrange
    setup({ previewKey: 'another-injection' });

    // Act & Assert
    expect(screen.getByTestId('injection-row-name')).not.toHaveStyle(
      `border-bottom: 2px solid ${theme.colors.accent}`
    );
  });

  it('has a correctly configured download link', () => {
    // Arrange
    const injection = {
      key: 0,
      type: 'footprint',
      name: 'test-injection',
      content: 'test-content',
    };
    const createObjectURL = vi
      .fn()
      .mockReturnValue('blob:http://localhost/mock-url');
    global.URL.createObjectURL = createObjectURL;
    setup({ injection });

    // Act
    const downloadLink = screen.getByTestId('injection-row-download');

    // Assert
    expect(downloadLink).toHaveAttribute(
      'aria-label',
      'download injection test-injection'
    );
    expect(downloadLink).toHaveAttribute('download', 'test-injection.js');
    expect(downloadLink).toHaveAttribute(
      'href',
      'blob:http://localhost/mock-url'
    );
  });
});
