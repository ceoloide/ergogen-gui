import styled from 'styled-components';
import { theme } from '../theme/theme';

const Title = styled.h3`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.white};
  margin: 1.5rem 0.5rem 1rem 0.5rem;
`;

export default Title;
