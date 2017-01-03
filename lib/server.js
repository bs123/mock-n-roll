'use strict';

const http = require('http');
const https = require('https');
const express = require('express');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const _ = require('lodash');
const cors = require('cors');

function MocknRoll(config) {
  let mocks = {};

  const app = express();

  const httpPort = config.httpPort || 8080;
  const httpsPort = config.httpsPort || 8443;
  const prefix = config.prefix || ''; // do we need this? what if we want to mock another route?
  const proxyTarget = config.target;
  const options = config.options || {};

  function shouldBeProxied(path) {
    const startsWithPrefix = path.match(`^${prefix}`);
    const mocked = !!mocks[path];
    return startsWithPrefix && !mocked;
  }

  function addMock(mock) {
    console.log(`Added mock to path: ${mock.path}`);
    mocks = _.extend(mocks, {
      [prefix + mock.path]: {
        code: mock.code,
        body: mock.body
      }
    });
  }

  function clearMocks() {
    console.log('Cleared all mocks');
    mocks = {};
  }

  function setup() {
    if (!proxyTarget) {
      throw new Error('Proxy target should be specified!');
    }

    app.use(cors()); // cors uses for avoiding cross origin issues

    // paths for configuring mocks on our proxy
    // body parser defined not on "/" because of https://github.com/chimurai/http-proxy-middleware/issues/40
    // proxy middleware has own bodyParser
    app.use('/mocks', bodyParser.json());

    app.post('/mocks', (req, res) => {
      const mock = req.body;
      addMock(mock);
      res.status(201).send();
    });

    app.get('/mocks', (req, res) => {
      res.status(200).send(mocks);
    });

    app.delete('/mocks', (req, res) => {
      clearMocks();
      res.status(204).send();
    });

    // our proxy
    app.use(prefix, proxy(shouldBeProxied, {
      target: proxyTarget,
      changeOrigin: true,
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.log('ERROR:' + err);
      }
    }));

    // our mocks
    app.all('*', (req, res) => {
      const path = req.params[0];
      const mock = mocks[path];

      if (mock !== undefined) {
        res.status(mock.code).send(mock.body);
      } else {
        res.status(404).send({ message: `No such path mocked: ${path}` });
      }
    });
  }

  this.start = () => new Promise((resolve, reject) => {
    setup();
    try {
      http.createServer(app).listen(httpPort);
      if (options.key && options.cert) {
        https.createServer(options, app).listen(httpsPort);
      }
    } catch (err) {
      return reject(err);
    }
    return resolve();
  });
}

module.exports = MocknRoll;
