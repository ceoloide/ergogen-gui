import React from 'react';
import styled from "styled-components";

type Props = {
    size?: string,
    children: React.ReactNode,
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    loading?: boolean,
};

const Button = styled.button`
  display: inline-block;
  border: none;
  padding: 1rem 2rem;
  margin: 0;
  text-decoration: none;
  background-color: #28a745;
  border-radius: .25rem;
  transition: color .15s ease-in-out,
  background-color .15s ease-in-out,
  border-color .15s ease-in-out,
  box-shadow .15s ease-in-out;
  color: #ffffff;
  font-family: sans-serif;
  font-size: 1.2rem;
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

  &.loading {
    background-color: #218838;
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 1em,
      #1e7e34 1em,
      #1e7e34 2em
    );
    background-size: 200% 200%;
    animation: barberpole 10s linear infinite;
  }
`;

const MediumButton = styled(Button)`
    padding: 0.7rem 1.4rem;
    font-size: 1rem;
`;

const SmallButton  = styled(Button)`
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
`;

const IconButton  = styled(Button)`
padding: 0.2rem 0.4rem;
font-size: 0.4rem;
`;

const styledButton = ({size, loading, ...rest}: Props): JSX.Element => {
    const className = loading ? 'loading' : '';
    const disabled = loading ? true : false;
    switch(size){
        case "icon":
            return <IconButton {...rest} className={className} disabled={disabled} />;
        case "sm":
        case "small":
            return <SmallButton {...rest} className={className} disabled={disabled} />;
        case "md":
        case "medium":
            return <MediumButton {...rest} className={className} disabled={disabled} />;
        case "lg":
        case "large":
        default:
            return <Button {...rest} className={className} disabled={disabled} />;
    }
};

export default styledButton;