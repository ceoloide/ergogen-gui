import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

type UnitType = 'U' | 'u' | 'mm' | 'deg';

interface UnitDefinition {
  value: UnitType;
  label: string;
  factor: number; // Multiplier to convert FROM base unit TO this unit
}

// Base unit is mm
const LENGTH_UNITS: UnitDefinition[] = [
  { value: 'U', label: 'U', factor: 1 / 19.05 },
  { value: 'u', label: 'u', factor: 1 / 19 },
  { value: 'mm', label: 'mm', factor: 1 },
];

const DEGREE_UNIT: UnitDefinition[] = [{ value: 'deg', label: '°', factor: 1 }];

interface UnitInputProps {
  value: number;
  onChange: (value: number) => void;
  type?: 'length' | 'angle';
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

const Container = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
  opacity: ${(p) => (p.$disabled ? 0.6 : 1)};
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};
  transition: border-color 0.2s ease;
  height: 32px;
  width: 100%;

  &:focus-within {
    border-color: ${theme.colors.accent};
  }
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.code};
  font-size: ${theme.fontSizes.bodySmall};
  padding: 0 4px;
  text-align: right;
  height: 100%;

  &:focus {
    outline: none;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const UnitSelector = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-left: 1px solid ${theme.colors.border};
  border-right: 1px solid ${theme.colors.border};
  color: ${theme.colors.textDark};
  font-family: ${theme.fonts.code};
  font-size: ${theme.fontSizes.bodySmall};
  padding: 0 2px;
  height: 100%;
  cursor: pointer;
  min-width: 20px;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${theme.colors.buttonHover};
    color: ${theme.colors.text};
  }
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 16px;
`;

const ControlButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-top: 1px solid ${theme.colors.border};
  color: ${theme.colors.textDark};
  cursor: pointer;
  padding: 0;
  transition: all 0.15s ease;

  &:first-child {
    border-top: none;
    border-bottom: 1px solid ${theme.colors.border};
  }

  &:hover {
    background-color: ${theme.colors.buttonHover};
    color: ${theme.colors.text};
  }

  .material-symbols-outlined {
    font-size: 14px;
  }
`;

export const UnitInput: React.FC<UnitInputProps> = ({
  value,
  onChange,
  type = 'length',
  step,
  min,
  max,
  disabled,
  className,
  style,
  placeholder,
}) => {
  const units = type === 'length' ? LENGTH_UNITS : DEGREE_UNIT;
  const [currentUnit, setCurrentUnit] = useState<UnitDefinition>(units[0]);
  const [inputValue, setInputValue] = useState<string>('');

  // Calculate displayed value based on current unit
  const getDisplayValue = useCallback((val: number, unit: UnitDefinition) => {
    const converted = val * unit.factor;
    // Round to 3 decimal places to avoid floating point errors
    return Math.round(converted * 1000) / 1000;
  }, []);

  // Update input value when prop value or unit changes
  useEffect(() => {
    if (value !== undefined && !isNaN(value)) {
      setInputValue(getDisplayValue(value, currentUnit).toString());
    } else {
      setInputValue('');
    }
  }, [value, currentUnit, getDisplayValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      // Convert back to base unit
      onChange(num / currentUnit.factor);
    }
  };

  const handleUnitClick = () => {
    if (units.length <= 1) return;
    const currentIndex = units.findIndex((u) => u.value === currentUnit.value);
    const nextIndex = (currentIndex + 1) % units.length;
    setCurrentUnit(units[nextIndex]);
  };

  const handleIncrement = () => {
    const currentVal = parseFloat(inputValue) || 0;
    const actualStep = step || (currentUnit.value === 'mm' ? 1 : 0.25);
    const newVal = currentVal + actualStep;

    // Check max
    if (max !== undefined && newVal / currentUnit.factor > max) return;

    // Update input immediately for responsiveness
    setInputValue(newVal.toString());
    onChange(newVal / currentUnit.factor);
  };

  const handleDecrement = () => {
    const currentVal = parseFloat(inputValue) || 0;
    const actualStep = step || (currentUnit.value === 'mm' ? 1 : 0.25);
    const newVal = currentVal - actualStep;

    // Check min
    if (min !== undefined && newVal / currentUnit.factor < min) return;

    setInputValue(newVal.toString());
    onChange(newVal / currentUnit.factor);
  };

  return (
    <Container className={className} style={style} $disabled={disabled}>
      <Input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        step={step}
      />
      <UnitSelector
        onClick={handleUnitClick}
        disabled={units.length <= 1 || disabled}
        title={units.length > 1 ? 'Click to change unit' : undefined}
      >
        {currentUnit.label}
      </UnitSelector>
      <Controls>
        <ControlButton
          onClick={handleIncrement}
          disabled={disabled}
          tabIndex={-1}
        >
          <span className="material-symbols-outlined">expand_less</span>
        </ControlButton>
        <ControlButton
          onClick={handleDecrement}
          disabled={disabled}
          tabIndex={-1}
        >
          <span className="material-symbols-outlined">expand_more</span>
        </ControlButton>
      </Controls>
    </Container>
  );
};
