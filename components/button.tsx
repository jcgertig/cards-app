import styled from 'styled-components';
import {
  borderRadius,
  buttonStyle,
  fontSize,
  space,
  variant
} from 'styled-system';

import theme from '../lib/theme';

const buttonSize = variant({
  prop: 'size',
  key: 'buttonSizes'
});

const Button = styled('button')(
  {
    appearance: 'button',
    border: 0,
    outline: 0
  },
  borderRadius,
  buttonStyle,
  buttonSize,
  space,
  fontSize,
  variant({
    variants: {
      primary: {
        color: theme.colors.white,
        backgroundColor: theme.colors.electronBlue
      },
      secondary: {
        color: theme.colors.white,
        backgroundColor: theme.colors.exodusFruit
      },
      danger: {
        color: theme.colors.white,
        backgroundColor: theme.colors.red
      }
    },
    sizes: {
      medium: {
        fontSize: theme.fontSizes[2],
        padding: `8px 16px`
      },
      large: {
        fontSize: theme.fontSizes[4],
        padding: `16px 32px`
      }
    }
  })
);

Button.defaultProps = {
  variant: 'primary',
  px: 4,
  py: 3,
  fontSize: 2,
  borderRadius: 2
};

export default Button;
