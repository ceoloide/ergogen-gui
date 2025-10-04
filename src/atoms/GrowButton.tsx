import styled from 'styled-components';

/**
 * A button that expands to fill the available horizontal space.
 */
const GrowButton = styled.button`
  background-color: #239923;
  transition: background-color 0.15s ease-in-out;
  border: none;
  border-radius: 6px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  height: 34px;
  font-family: 'Roboto', sans-serif;
  flex-grow: 1;

  .material-symbols-outlined {
    font-size: 16px !important;
  }

  &:hover {
    background-color: #1e8e1e;
  }
`;

export default GrowButton;
