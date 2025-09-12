import React from 'react';
import styled from "styled-components";

type Props = {
    size?: string,
    children: React.ReactNode,
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
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

const _styledButton = ({size, ...rest}: Props, ref: React.ForwardedRef<HTMLButtonElement>): JSX.Element => {
    switch(size){
        case "icon":
            return <IconButton {...rest} ref={ref} />;
        case "sm":
        case "small":
            return <SmallButton {...rest} ref={ref} />;
        case "md":
        case "medium":
            return <MediumButton {...rest} ref={ref} />;
        case "lg":
        case "large":
        default:
            return <Button {...rest} ref={ref} />;
    }
};

const styledButton = React.forwardRef(_styledButton);

export default styledButton;