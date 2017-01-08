'use strict';

const program = require('commander');
const path = require('path');

program
  .description('mock-n-roll')
  .option('-c, --config [path]', 'configuration file for mock-n-roll')
  .option('-d, --debug', 'enable debug log')
  .parse(process.argv);

let configPath = path.join(process.cwd(), '/mock-n-roll.conf.js'); // default value

if (program.config) {
  // if relative path to config
  if (program.config.startsWith('./') || program.config.startsWith('../')) {
    configPath = path.join(process.cwd(), program.config);
  } else {
    configPath = program.config;
  }
}

/* eslint-disable */
const config = require(configPath);
/* eslint-enable */

module.exports.config = config;
module.exports.debug = program.debug;
