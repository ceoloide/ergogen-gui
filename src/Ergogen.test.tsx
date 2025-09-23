import { render, screen } from '@testing-library/react';
import Ergogen from './Ergogen';
import ConfigContextProvider from './context/ConfigContext';
import EmptyYAML from './examples/empty_yaml';

test('renders the Ergogen component without crashing', () => {
  render(
    <ConfigContextProvider initialInput={EmptyYAML.value}>
      <Ergogen />
    </ConfigContextProvider>
  );
  const generateButton = screen.getByText(/Generate/i);
  expect(generateButton).toBeInTheDocument();
});
