const {setup: detoxSetup} = require('detox');
const config = require('../.detoxrc.js'); // Adjust the path as necessary

module.exports = async () => {
  await detoxSetup(config);

  // Set a global variable to indicate test mode
  global.__IS_TEST_MODE__ = true;
};
