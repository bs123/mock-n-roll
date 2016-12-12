<img src="http://openclipart.org/download/28383/Dug-Rock-On.svg" width="10%" height="10%">

# mock-n-roll
>configurable rest service system mock

## Demo


``` bash
$ git commit -a  --author="bs <email>" -m "readme"
```

### mock-n-roll.config.js
```javascript
module.exports = {
    vHost: 'my.funny.domain.dev',
    baseUrl: '/api/v1',
    port: 1234
}
```

### TODO
- [ ] get rid of connect-*
- [ ] cross-env or cli or node standard: http://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-node-js
- [ ] author
- [ ] default overrule pathes (feature)
- [ ] SwaggerDoc
- [ ] licence
- [ ] mxd-eslint

### curl example
e.g.
http://localhost:3081/mock/configure/tainenvironment/423

accept: application/json
accept-encoding: gzip, deflate
accept-language: en-US,en;q=0.8
content-type: application/json
user-agent: ci

  				{
                    "location": {"longitude": 79.582, "latitude": 99.1351},
                    "zipId": "11000135",
                    "ssd": {},
                    "connection": {"wifiStatus": "OK", "radioStatus": "HIGH"}
                }

### used/liked
                *  express
                *  (https://github.com/icholy/ttygif)