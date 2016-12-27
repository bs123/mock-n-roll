'use strict';

const http = require('http');
const https = require('https');
const express = require('express');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const _ = require('lodash');

function MocknRoll(config) {
  let mocks = {};

  const app = express();

  const vhostname = config.vhostname || 'localhost';
  const httpPort = config.httpPort || 8080;
  const httpsPort = config.httpsPort || 8443;
  const prefix = config.prefix || ''; // do we need this? what if we want to mock another route?
  const proxyTarget = config.target;
  const options = config.options || {};

  function shouldBeProxied(pathname) {
    const startsWithPrefix = pathname.match(`^${prefix}`);
    const mocked = !!mocks[pathname];
    return startsWithPrefix && !mocked;
  }

  function addMock(mock) {
    mocks = _.extend(mocks, {
      [prefix + mock.url]: {
        code: mock.code, body: mock.body
      }
    });
  }

  function clearMocks() {
    mocks = {};
  }

  function setup() {
    if (!proxyTarget) {
      throw new Error('Proxy target should be specified!');
    }

    // todo need to add virtual hosts?
    app.use(prefix, proxy(shouldBeProxied, {
      target: proxyTarget,
      changeOrigin: true,
      logLevel: 'warn'
    }));

    app.use(bodyParser.json());

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

  return new Promise((resolve, reject) => {
    setup();
    try {
      http.createServer(app).listen(httpPort);
      if (options.key && options.cert) {
        https.createServer(options, app).listen(httpsPort);
      }
    } catch (err) {
      reject(err);
    }
    return resolve();
  });
}

module.exports = MocknRoll;
