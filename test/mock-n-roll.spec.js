/* global define, it, describe, before */

'use strict';

const index = require('../index');
const assert = require('assert');
const request = require('request');
const nock = require('nock');

const MocknRoll = index.server;
const MocknRollClient = index.client;

describe('Mock-n-Roll', () => {
  let mockClient;

  const serverConfig = {
    httpPort: 8080,
    httpsPort: 8443,
    prefix: '',
    target: 'https://json-dummy.com',
    options: {}
  };

  const clientConfig = {
    host: 'localhost',
    port: 8080
  };

  const postsOriginResponse = {
    userId: 1,
    id: 1,
    title: 'Hello world!',
    body: 'Hello world!'
  };

  const postsMock = {
    path: '/posts/1',
    code: 404,
    body: {
      msg: 'Requested post was not found!'
    }
  };

  before(() => {
    nock('https://json-dummy.com')
      .get('/posts/1')
      .reply('200', postsOriginResponse);

    new MocknRoll(serverConfig).start()
      .then(() => { })
      .catch((err) => {
        throw new Error(err);
      });

    mockClient = new MocknRollClient(clientConfig);
  });

  it('returns 200 and empty JSON object, when here are no mocked routes', (done) => {
    mockClient.get((error, response, body) => {
      assert.equal(response.statusCode, 200);
      assert.deepEqual(JSON.parse(body), {});
      done();
    });
  });

  it('returns response from origin, when here is no mock for requested route', (done) => {
    const expectedBody = postsOriginResponse;

    request
      .get('http://localhost:8080/posts/1', (error, response, body) => {
        assert.equal(response.statusCode, 200);
        assert.deepEqual(JSON.parse(body), expectedBody);
        done();
      });
  });

  it('returns 201 and empty body, when new mocked route is added', (done) => {
    const mock = postsMock;

    mockClient.add(mock, (error, response, body) => {
      assert.equal(response.statusCode, 201);
      assert.equal(body, undefined);
      done();
    });
  });

  it('returns 200 and JSON object with all mocked routes', (done) => {
    const expectedBody = {
      '/posts/1': {
        body: {
          msg: 'Requested post was not found!'
        },
        code: 404
      }
    };

    mockClient.get((error, response, body) => {
      assert.equal(response.statusCode, 200);
      assert.deepEqual(JSON.parse(body), expectedBody);
      done();
    });
  });

  it('returns mocked response with appropriate code and body for requested route', (done) => {
    const expectedBody = postsMock.body;
    const expectedStatusCode = postsMock.code;

    request
      .get('http://localhost:8080/posts/1', (error, response, body) => {
        assert.equal(response.statusCode, expectedStatusCode);
        assert.deepEqual(JSON.parse(body), expectedBody);
        done();
      });
  });

  it('returns 204 and empty body, when server cleared all mocks', (done) => {
    mockClient.clear((error, response, body) => {
      assert.equal(response.statusCode, 204);
      assert.equal(body, ''); // todo strange check
      done();
    });
  });

  it('returns 200 and empty JSON object, when here are no mocked routes', (done) => {
    mockClient.get((error, response, body) => {
      assert.equal(response.statusCode, 200);
      assert.deepEqual(JSON.parse(body), {});
      done();
    });
  });
});
