import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'ean73n',
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'http://local.torder.io:8080',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 20000,
  },
});
