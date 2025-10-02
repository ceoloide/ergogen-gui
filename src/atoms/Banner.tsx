import React from 'react';
import styled from 'styled-components';

interface BannerProps {
  type: 'error' | 'warning';
  message: string;
  onDismiss: () => void;
  topOffset?: string;
}

const ERROR_COLORS = {
  background: '#fdecea',
  border: '#d9534f',
  text: '#d9534f',
};

const WARNING_COLORS = {
  background: '#fff8e1',
  border: '#f0ad4e',
  text: '#8a6d3b',
};

const BannerContainer = styled.div<{ type: 'error' | 'warning'; topOffset: string }>`
  position: fixed;
  top: ${(props) => props.topOffset};
  left: 50%;
  transform: translateX(-50%);
  padding: 16px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  width: 80%;
  max-width: 900px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);

  background-color: ${(props) => (props.type === 'error' ? ERROR_COLORS.background : WARNING_COLORS.background)};
  color: ${(props) => (props.type === 'error' ? ERROR_COLORS.text : WARNING_COLORS.text)};
  border-left: 5px solid ${(props) => (props.type === 'error' ? ERROR_COLORS.border : WARNING_COLORS.border)};
`;

const Message = styled.span`
  margin-right: 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

const Banner: React.FC<BannerProps> = ({ type, message, onDismiss, topOffset = '20px' }) => {
  return (
    <BannerContainer type={type} topOffset={topOffset}>
      <Message>{message}</Message>
      <DismissButton onClick={onDismiss}>&times;</DismissButton>
    </BannerContainer>
  );
};

export default Banner;