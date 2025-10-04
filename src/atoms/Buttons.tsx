import React from 'react';
import styled, { css } from 'styled-components';

type Props = {
  size?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> | undefined;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
};

const baseButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin: 0;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  text-align: center;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const primaryButtonStyles = css`
  ${baseButtonStyles}
  background-color: #28a745;
  border-radius: 0.25rem;
  color: #ffffff;
  padding: 1rem 2rem;

  &:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }
`;

const BaseButton = styled.button`
  ${primaryButtonStyles}
`;

const MediumButton = styled(BaseButton)`
  padding: 0.7rem 1.4rem;
  font-size: 1rem;
`;

const SmallButton = styled(BaseButton)`
  padding: 8px 12px;
  font-size: 0.8rem;
`;

const IconButton = styled(BaseButton)`
  padding: 8px 12px;
  font-size: 0.4rem;
`;

const Button = ({ size, ...rest }: Props): JSX.Element => {
  switch (size) {
    case 'icon':
      return <IconButton {...rest} />;
    case 'sm':
    case 'small':
      return <SmallButton {...rest} />;
    case 'md':
    case 'medium':
      return <MediumButton {...rest} />;
    case 'lg':
    case 'large':
    default:
      return <BaseButton {...rest} />;
  }
};

const DownloadButton = styled(Button)`
  width: 3.7rem;
  height: 3.7rem;
  padding: 1rem;
`;

const outlineStyles = css`
  ${baseButtonStyles}
  background-color: transparent;
  border: 1px solid #3f3f3f;
  border-radius: 6px;
  color: white;
  padding: 8px 12px;
  font-size: 13px;
  line-height: 16px;
  gap: 6px;
  height: 34px;

  .material-symbols-outlined {
    font-size: 16px !important;
  }

  &:hover,
  &.active {
    background-color: #3f3f3f;
  }
`;

const OutlineLinkButton = styled.a<Props>`
  ${outlineStyles}
`;

const AccentButton = styled.button<Props>`
  ${outlineStyles}
  background-color: #28a745;
  border-color: #28a745;

  &:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }
`;

const darkLinkButtonStyles = css`
  ${baseButtonStyles}
  background-color: #222222;
  border: none;
  border-radius: 6px;
  color: white;
  padding: 4px 6px;
  font-size: 13px;
  line-height: 16px;
  gap: 6px;
  height: 34px;

  .material-symbols-outlined {
    font-size: 16px !important;
  }

  &:hover {
    background-color: #3f3f3f;
  }
`;

const DarkLinkButton = styled.a<Props>`
  ${darkLinkButtonStyles}
`;

const generateButtonStyles = css`
  ${baseButtonStyles}
  background-color: #239923;
  border-radius: 6px;
  color: white;
  height: 34px;
  padding: 8px 12px !important;

  .material-symbols-outlined {
    font-size: 16px !important;
  }

  &:hover {
    background-color: #1e8e1e;
  }
`;

const GenerateButton = styled.button<Props>`
  ${generateButtonStyles}
`;

export {
  Button,
  DownloadButton,
  OutlineLinkButton,
  AccentButton,
  DarkLinkButton,
  GenerateButton,
};