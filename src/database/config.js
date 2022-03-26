/**
 * @description - This config file populates an object with all of the config profiles in the root directory. When exported, these configs can be accessed from the config node_module.
 * @module database/models/config
 */
require('dotenv').config();
const profiles = require('../../config');

const dbConfigs = {};

Object.keys(profiles).forEach((profile) => {
  dbConfigs[profile] = { ...profiles[profile].database };
});

module.exports = dbConfigs;
