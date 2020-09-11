export default {
  colors: {
    black: '#000e1a',
    white: '#fff',
    electronBlue: '#0984e3',
    exodusFruit: '#6c5ce7',
    red: '#ff4d4f',
    accent: '#4caac6',
    dark: '#1e2832',
    gray: '#f0f0f0',
    light: '#9c9fae',
    base: '#4e5264'
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  radii: [0, 2, 4, 8],
  fontSizes: [12, 14, 16, 20, 24, 32]
};

const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px'
};

export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktop})`,
  tabletMax: `(max-width: 767px)`
};
