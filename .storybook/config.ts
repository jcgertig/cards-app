import { configure, addParameters } from '@storybook/react';
import theme from './theme';

declare var action;

addParameters({
  options: {
    theme,
  },
});

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.tsx?$/), module);

// Gatsby's Link overrides:
// Gatsby defines a global called ___loader to prevent its method calls from creating console errors you override it here
(global as any).___loader = {
  // eslint-disable-line ts-ignore
  enqueue: () => {},
  hovering: () => {},
};
// Gatsby internal mocking to prevent unnecessary errors in storybook testing environment
(global as any).__PATH_PREFIX__ = '';
// This is to utilized to override the window.___navigate method Gatsby defines and uses to report what path a Link would be taking us to if it wasn't inside a storybook
(window as any).___navigate = (pathname) => {
  action('NavigateTo:')(pathname);
};
