const fs = require('fs');

module.exports = {
  httpPort: 8080,
  httpsPort: 8443,
  prefix: '',
  target: 'https://json-dummy.com',
  options: {
    key: fs.readFileSync(`${__dirname}/example.com.key`, 'utf-8'),
    cert: fs.readFileSync(`${__dirname}/example.com.cert`, 'utf-8')
  }
};
