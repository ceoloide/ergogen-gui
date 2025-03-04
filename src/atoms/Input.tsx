import styled from "styled-components";

const styledInput = styled.input.attrs<{ $size?: string; }>(props => ({
  // we can define static props
  type: "text",

  // or we can define dynamic ones
  $size: props.$size || "0.5em",
}))`
  font-size: 1em;
  border: 2px solid rgb(193, 193, 193);
  border-radius: 3px;
  background: #2d2d2d;
  color: #fff;
  /* here we use the dynamically computed prop */
  margin: ${props => props.$size};
  padding: ${props => props.$size};
`;

export default styledInput;