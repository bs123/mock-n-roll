const request = require('request');
const logger = require('winston');

function handleError(message) {
  return (err) => {
    logger.error(message);
    logger.error(err.stack);
  };
}

function MocknRollClient(config) {
  if (!config) {
    throw new Error('Config should be provided for the client');
  }

  if (!config.host || !config.port) {
    throw new Error('Not all properties were specified for config');
  }

  const host = config.host || 'localhost';
  const port = config.port || 8080;

  // const mocksUrl = `${config.protocol}://${config.host}:${config.port}/mocks`;
  const mocksUrl = `http://${host}:${port}/mocks`;

  this.add = (mock, cb) => {
    // self-signed certificate can cause issues so use HTTP for mock configuration
    request
      .post({ url: mocksUrl, json: mock }, cb)
      .on('error', handleError('Failed to mock path...'));
  };

  this.get = (cb) => {
    request
      .get(mocksUrl, cb)
      .on('error', handleError('Failed to get mocked paths...'));
  };

  this.clear = (cb) => {
    request
      .delete(mocksUrl, cb)
      .on('error', handleError('Failed to clear mocked paths...'));
  };
}

module.exports = MocknRollClient;
