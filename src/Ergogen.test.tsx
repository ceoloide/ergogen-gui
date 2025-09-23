import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Ergogen from './Ergogen';
import ConfigContextProvider from './context/ConfigContext';
import EmptyYAML from './examples/empty_yaml';

test('renders the Ergogen component without crashing', async () => {
  jest.useFakeTimers();
  // @ts-ignore
  window.ergogen = {
    process: jest.fn().mockResolvedValue({ demo: { svg: '<svg></svg>' } }),
    inject: jest.fn()
  };

  await act(async () => {
    render(
      <ConfigContextProvider initialInput={EmptyYAML.value}>
        <Ergogen />
      </ConfigContextProvider>
    );
    jest.runAllTimers();
  });

  const generateButton = screen.getByText(/Generate/i);
  expect(generateButton).toBeInTheDocument();
});
