import styled from 'styled-components';

import theme, { device } from '../../lib/theme';

export const HeaderFamilyFont = `'Work Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`;
export const BodyFamilyFont = `'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`;

export const H1 = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${HeaderFamilyFont};
  line-height: 1.08365;
  font-weight: 600;
  font-size: 32px;
  letter-spacing: -0.003em;
  @media ${device.tablet} {
    font-size: 48px;
  }
`;

export const H2 = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${HeaderFamilyFont};
  font-size: 40px;
  line-height: 1.1;
  font-weight: 600;
  letter-spacing: 0em;
`;

export const H3 = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${HeaderFamilyFont};
  font-size: 24px;
  line-height: 1.16667;
  font-weight: 600;
  letter-spacing: 0.009em;
  margin-bottom: ${({ vMargin }) => vMargin}px;

  display: flex;
  ${({ removeTrailing }) =>
    removeTrailing
      ? null
      : `&:after {
      content: '';
      flex: 1;
      border-bottom: 1px solid ${theme.colors.accent};
      margin: auto 1em;
    }`}
`;

export const H4 = styled.h4`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${HeaderFamilyFont};
  font-size: 20px;
  line-height: 1.16667;
  font-weight: 600;
  letter-spacing: 0.009em;
  margin-bottom: ${({ vMargin }) => vMargin}px;
`;

export const Text = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${BodyFamilyFont};
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
`;

export const Disclaimer = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${BodyFamilyFont};
  font-size: 11px;
  font-weight: 400;
  line-height: 1.2;
`;

export const Strong = styled.span`
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
`;

export const Shadow = `5px 8px 24px 5px rgba(208,216,243, 0.6)`;
export const ShadowDark = `5px 8px 24px 5px rgba(0,0,0, 0.2)`;
