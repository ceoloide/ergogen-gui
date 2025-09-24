import React from 'react';
import { render } from '@testing-library/react';
import JscadPreview from './JscadPreview';

describe('JscadPreview', () => {
  const mockAdd = jest.fn();
  const mockViewer = jest.fn();

  beforeAll(() => {
    (global as any).myjscad = {
      Viewer: function() {
        return {
          add: mockAdd
        }
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockViewer.mockClear();
  });

  it('should create a viewer and add the jscad string', () => {
    const jscadString = 'some jscad data';
    render(<JscadPreview jscad={jscadString} />);
    expect(mockAdd).toHaveBeenCalledWith(jscadString);
  });
});