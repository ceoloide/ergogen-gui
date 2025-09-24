import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tabs from './Tabs';

const mockTabs = [
  {
    label: 'Tab 1',
    content: <div>Content 1</div>,
  },
  {
    label: 'Tab 2',
    content: <div>Content 2</div>,
  },
];

describe('Tabs', () => {
  it('renders the tabs and the initial content', () => {
    render(<Tabs tabs={mockTabs} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('switches to the correct tab on click', () => {
    render(<Tabs tabs={mockTabs} />);
    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });
});