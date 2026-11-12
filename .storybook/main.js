const config = {
  stories: ['../blocks/**/*.stories.js'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  staticDirs: [{ from: '../images', to: '/images' }],
};

export default config;
