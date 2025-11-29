import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
  height: 36px;
  width: 100%;
`;

const StyledInput = styled.input`
  background: transparent;
  border: none;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.bodyMedium};
  padding: 0 12px;
  width: 100%;
  text-align: right;
  outline: none;

  /* Remove spinners */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const UnitButton = styled.button`
  background: transparent;
  border: none;
  border-left: 1px solid ${theme.colors.border};
  border-right: 1px solid ${theme.colors.border};
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.bodyMedium};
  padding: 0 12px;
  height: 100%;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: ${theme.fontWeights.semiBold};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;

  &:hover {
    background: ${theme.colors.buttonHover};
  }
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 24px;
`;

const ArrowButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50%;
  width: 100%;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s;

  &:hover {
    background: ${theme.colors.buttonHover};
  }

  /* Bottom button needs border top to separate from top button */
  &:last-child {
      border-top: 1px solid ${theme.colors.border};
  }

  .material-symbols-outlined {
      font-size: 16px;
  }
`;

interface Props {
  value: number;
  unit: string;
  step: number;
  onChange: (val: number) => void;
  onUnitChange: (unit: string) => void;
  'aria-label'?: string;
}

const UNITS = ['mm', 'U', 'u'];

const UnitInput: React.FC<Props> = ({ value, unit, step, onChange, onUnitChange, 'aria-label': ariaLabel }) => {

  const handleUnitClick = () => {
      const idx = UNITS.indexOf(unit);
      const nextUnit = UNITS[(idx + 1) % UNITS.length];
      onUnitChange(nextUnit);
  };

  const handleIncrement = () => {
      // Use toFixed to avoid precision errors, then parse back
      const newVal = parseFloat((value + step).toFixed(4));
      onChange(newVal);
  };

  const handleDecrement = () => {
      const newVal = parseFloat((value - step).toFixed(4));
      // Prevent negative grid size? Usually grid size > 0.
      if (newVal > 0) {
          onChange(newVal);
      }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val)) {
          onChange(val);
      }
  };

  return (
    <Wrapper>
      <StyledInput
        type="number"
        value={value}
        onChange={handleInputChange}
        aria-label={ariaLabel}
      />
      <UnitButton onClick={handleUnitClick} aria-label="Change unit" title="Click to cycle units">
        {unit}
      </UnitButton>
      <Controls>
        <ArrowButton onClick={handleIncrement} aria-label="Increase value">
            <span className="material-symbols-outlined">expand_less</span>
        </ArrowButton>
        <ArrowButton onClick={handleDecrement} aria-label="Decrease value">
            <span className="material-symbols-outlined">expand_more</span>
        </ArrowButton>
      </Controls>
    </Wrapper>
  );
};

export default UnitInput;
