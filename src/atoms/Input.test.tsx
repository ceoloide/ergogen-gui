import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Input from './Input';

describe('Input', () => {
  it('renders the input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('can be typed into', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });

  it('accepts a size prop', () => {
    render(<Input $size="1em" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});