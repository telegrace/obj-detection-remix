import { defineConfig } from "cypress";

export default defineConfig({
  fixturesFolder: "./e2e/fixtures",
  downloadsFolder: "./e2e/downloads",
  screenshotOnRunFailure: true,
  screenshotsFolder: "./e2e/screenshots",
  video: false,
  chromeWebSecurity: false,
  projectId: "cvig2r",
  retries: {
    runMode: 1,
    openMode: 1,
  },
  pageLoadTimeout: 40000,
  defaultCommandTimeout: 40000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    // setupNodeEvents(on, config) {
    //   return require("./e2e/plugins/index.js")(on, config);
    // },
    baseUrl: "http://localhost:3000/",
    specPattern: "./cypress/e2e/integration/**/*.{js,jsx,ts,tsx}",
    supportFile: "./cypress/support/index.ts",
    //Path to file to load before spec files load. This file is compiled and bundled. (Pass false to disable)
  },
});
