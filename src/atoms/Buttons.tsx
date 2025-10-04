import React from 'react';
import styled, { css } from 'styled-components';

// Base props for all button/link components
type Props = {
  size?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  as?: React.ElementType; // For polymorphism
};

// --- 1. Primary Button (from original Button.tsx) ---
const primaryButtonStyles = css`
  display: inline-block;
  border: none;
  padding: 1rem 2rem;
  margin: 0;
  text-decoration: none;
  background-color: #28a745;
  border-radius: 0.25rem;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  color: #ffffff;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  text-align: center;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }
  &:active {
    transform: scale(0.98);
    outline: 2px solid #fff;
    outline-offset: -5px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled.button<Props>`${primaryButtonStyles}`;
const MediumButton = styled(PrimaryButton)`
  padding: 0.7rem 1.4rem;
  font-size: 1rem;
`;
const SmallButton = styled(PrimaryButton)`
  padding: 8px 12px;
  font-size: 0.8rem;
`;
const IconButton = styled(PrimaryButton)`
  padding: 8px 12px;
  font-size: 0.4rem;
`;

// Factory component for sized buttons
const Button = ({ size, ...rest }: Props): JSX.Element => {
  switch (size) {
    case 'icon':
      return <IconButton {...rest} />;
    case 'sm': case 'small':
      return <SmallButton {...rest} />;
    case 'md': case 'medium':
      return <MediumButton {...rest} />;
    case 'lg': case 'large': default:
      return <PrimaryButton {...rest} />;
  }
};

// --- 2. Square Download Button (from DownloadButton.tsx) ---
const SquareDownloadButton = styled(Button)`
  width: 3.7rem;
  height: 3.7rem;
  padding: 1rem;
`;

// --- 3. Outline Button (from Header.tsx, Ergogen.tsx) ---
const outlineStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  transition: color .15s ease-in-out,
    background-color .15s ease-in-out,
    border-color .15s ease-in-out,
    box-shadow .15s ease-in-out;
  border: 1px solid #3f3f3f;
  border-radius: 6px;
  color: white;
  padding: 8px 12px;
  text-decoration: none;
  cursor: pointer;
  font-size: 13px;
  line-height: 16px;
  gap: 6px;
  height: 34px;
  font-family: 'Roboto', sans-serif;

  .material-symbols-outlined {
    font-size: 16px !important;
  }

  &:hover, &.active {
    background-color: #3f3f3f;
  }
`;
const OutlineButton = styled.button<Props>`${outlineStyles}`;

// --- 4. Accent Button (from Header.tsx) ---
const AccentButton = styled(OutlineButton)`
  background-color: #28a745;
  border-color: #28a745;

  &:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }
`;

// --- 5. Generate Button (from Ergogen.tsx) ---
const generateStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #239923;
  transition: background-color 0.15s ease-in-out;
  border: none;
  border-radius: 6px;
  color: white;
  text-decoration: none;
  cursor: pointer;
  height: 34px;
  font-family: 'Roboto', sans-serif;
  padding: 8px 12px !important;

  .material-symbols-outlined {
    font-size: 16px !important;
  }

  &:hover {
    background-color: #1e8e1e;
  }
`;
const GenerateButton = styled.button<Props>`${generateStyles}`;

// --- 6. DownloadRow Button (from DownloadRow.tsx) ---
const downloadRowStyles = css`
  background-color: #222222;
  border: none;
  border-radius: 6px;
  color: white;
  display: flex;
  align-items: center;
  padding: 4px 6px;
  text-decoration: none;
  cursor: pointer;
  font-size: 13px;
  line-height: 16px;
  gap: 6px;
  height: 34px;
  font-family: 'Roboto', sans-serif;

  .material-symbols-outlined {
      font-size: 16px !important;
  }

  &:hover {
      background-color: #3f3f3f;
  }
`;
const DownloadRowButton = styled.a<Props>`${downloadRowStyles}`;

export {
  Button,
  SquareDownloadButton,
  OutlineButton,
  AccentButton,
  GenerateButton,
  DownloadRowButton
};