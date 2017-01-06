<img src="http://openclipart.org/download/28383/Dug-Rock-On.svg" width="10%" height="10%">

# mock-n-roll

Configurable server for proxing and mocking REST.

## Motivation

* You don't need mock-n-roll for mocking service layers in your unit tests, use [Sinion](http://sinonjs.org/).
* You don't need mock-n-roll for mocking http requests in your integration tests, use network interceptors - [Nock](https://github.com/node-nock/nock) is cool.
* When doing blackbox testing of your client side code, you may want to use `mock-n-roll`.

## Demo

Below a short recorded demo, it should you give first impression about tool.

<script type="text/javascript" src="https://asciinema.org/a/6f78jzqb7jq9t9qdrogxa5fog.js" id="asciicast-6f78jzqb7jq9t9qdrogxa5fog" async></script>

## Example

Let's imagine that you have REST service which implements following call:

```
GET https://jsonplaceholder.typicode.com/posts/1 200

Response:
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
```

And you would like to change response body and status code for it as well.

Something like this:

```
GET https://jsonplaceholder.typicode.com/posts/1 404

Response:
{
  "msg": "Requested post wasn't found!"
}
```

As mentioned above you can use **nock** but in some cases you need a proxy that additionaly can change responses.

**Mock-n-roll** works as usual proxy that redirects all not mocked requests to target, and otherwise if mock found it will be used to return appropriate response to caller.

## Usage

First of all you need to define configuration file for your proxy server.

``` javascript
// mock-n-roll.conf.js - default name for config file

module.exports = {
  httpPort: 8080,
  httpsPort: 8443,
  prefix: '',
  target: 'https://jsonplaceholder.typicode.com',
  options: {
    key: fs.readFileSync(`${__dirname}/ssl.key`, 'utf-8'),
    cert: fs.readFileSync(`${__dirname}/ssl.cert`, 'utf-8')
  }
};
```

* httpPort - defines port on which HTTP will be served.
* httpsPort - defines port on which HTTPS will be served.
* target - host to which requests will be proxied.
* prefix - prefix which will be used for proxy (for example, proxy only requests under `/api/v1`).
* options - contains only string values of key and cert for HTTPS, if options not defined, then server will run only HTTP.

By default config file will be searched in current working directory from which node process was started.

Easily you can start server using existed runner:

```
./bin/mock-n-roll --config ./my-custom-config.js --debug
```

A little bit about runner options:

* debug - run server with debug messages.
* config - custom path to config file, if not specified then default `mock-n-roll.conf.js` will be used.

After you should see something like this:

```bash
$ ./bin/mock-n-roll -c ./example/mock-n-roll.conf.js
info: Mock-n-Roll started...
info: HTTP  : 8080
info: HTTPS : 8443
info: Target: https://jsonplaceholder.typicode.com
info: Prefix: [none]
```

Now you `mock-n-roll` server is started and you can send requests to 'localhost' and it will redirect it to 'jsonplaceholder.typicode.com'.

Use `/mocks` route to configure your mocks.

POST - add new mock, or override existing.

```
POST http://localhost:8080/mocks 201

Payload:
{
  "path": "/posts/1",
  "code": 404,
  "body": {
    "msg": "Requested post wasn't found!"
  }
}
```

GET - returns all mocked routes.

```
GET http://localhost:8080/mocks 200

Response:
{
  "/posts/1": {
    "body": {
      "msg": "Requested post was not found!"
    },
    "code": 404
  }
};
```

DELETE - delete all existing mocked routes.

```
DELETE http://localhost:8080/mocks 204
```

For more convinent usage you can use existing REST client to access mock-n-roll server.

```javascript
const MocknRollClient = require('mock-n-roll').client;

const client = new MocknRollClient({ host: 'localhost', port: 8080 });

const mock = {
  path: '/posts/1',
  code: 404,
  body: {
    msg: 'Requested post was not found!'
  }
};

client.add(mock, (error, response, body) => {
    // do something in callback
});

client.get((error, response, body) => {
    // do something in callback
});

client.delete((error, response, body) => {
    // do something in callback
});

```

Also you could look at the tests, it should give you additional information how you could run and use mock-n-roll.

## License

Copyright 2016

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
[apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
