import React from 'react';
import { render, screen } from '@testing-library/react';
import PreviewLoader from './PreviewLoader';

describe('PreviewLoader', () => {
  it('renders with default loading text', () => {
    render(<PreviewLoader />);
    expect(screen.getByText('Loading Preview')).toBeInTheDocument();
    expect(screen.getByAltText('Loading...')).toBeInTheDocument();
  });

  it('renders custom loading text', () => {
    render(<PreviewLoader text="Generating 3D model" />);
    expect(screen.getByText('Generating 3D model')).toBeInTheDocument();
  });

  it('renders correct loader layout components', () => {
    render(<PreviewLoader />);
    expect(screen.getByTestId('preview-loader')).toBeInTheDocument();
  });
});
