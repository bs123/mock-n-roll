//const fs = require('fs');
const express = require('express');
const cors = require('cors');
const vhost = require('vhost');
const connectRoute = require('connect-route');
//const send = require('connect-send-json').json();
const bodyParser = require('body-parser');
//const error = require('connect-send-error').error();
const _ = require('lodash');

const server = express();
const api = express();
const port = 3081;
const baseUrl = '/api/v1';

var   mocked = {};

//http://underscorejs.org/#extend
//    var result={};
//Object.keys(obj1).forEach((key) => result[key] = obj1[key]);
//Object.keys(obj2).forEach((key) => result[key] = obj2[key]);

//method({
//    ...object1,
//    ...object2
//})

//const https = require('https');

//const options = {
//    key:    fs.readFileSync('ssl/key.pem'),
//    cert:   fs.readFileSync('ssl/cert.pem'),
//ca:     fs.readFileSync('ssl/ca.crt')
//};

var mockedRoute = (req, res, next) => {
    if (typeof mocked[req.params.call] != 'undefined') {
        res.statusCode = mocked[req.params.call].httpStatus;
        res.send(mocked[req.params.call].mockResponse);
    }
};

// https.createServer(server).listen(port);
// https.createServer(options,server).listen(port);

server.listen(port, () => {
    console.log('Mock\'n\'Roll running on port ' + port + ' ...');
});

server.use(vhost('yourFunny.domain.de', api));
server.use(vhost('localhost', api));
api.use(cors());
// api.use(error);
//api.use(send);
api.use(connectRoute((router) => {

        router.get(baseUrl + '/*/:call/', (req, res, next) => {
            mockedRoute(req, res, next);
            next();
        });
        router.get(baseUrl + '/:call/', (req, res, next) => {
            mockedRoute(req, res, next);
            next();
        });
        router.post(baseUrl + '/*/:call/', (req, res, next) => {
            mockedRoute(req, res, next);
            next();
        });
        router.post(baseUrl + '/:call/', (req, res, next) => {
            mockedRoute(req, res, next);
            next();
        });

        api.use(bodyParser.json());

        router.post('/mock/configure/:call/:httpStatus',  (req, res, next) => {
            var mockedCallName = req.params.call;
            var mockedStatusCode = req.params.httpStatus;
            var curCall = { [mockedCallName]: {
             httpStatus: mockedStatusCode, mockResponse: req.body}};
            //http://stackoverflow.com/questions/19965844/lodash-difference-between-extend-assign-and-merge
            mocked = _.extend(
                mocked,
                { [mockedCallName]: {
                    httpStatus: mockedStatusCode, mockResponse: req.body}});
            res.statusCode = 200;
            res.send( mocked );

            next();
        });

        router.get(baseUrl + '/info/environmentdata', (req, res, next) => {
            //if (typeof mocked['trainenvironmentdata'] != 'undefined') {
            //        mockedRoute(req, res, next);
            //}
            res.statusCode = 200;
            res.send(
                {
                    "location": {"longitude": 11.582, "latitude": 48.1351},
                    "zipId": "00000135",
                    "ssd": {},
                    "connection": {"wifiStatus": "OK", "radioStatus": "HIGH"}
                }
            );
            next();
        });

}));
