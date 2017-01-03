const program = require('commander');
const path = require('path');

program
  .description('mock-n-roll')
  .option('-c, --config [path]', 'configuration file for mock-n-roll')
  .parse(process.argv);

const configPath = program.config || path.join(process.cwd(), '/mock-n-roll.conf.js');
const config = require(configPath);

module.exports.config = config;
