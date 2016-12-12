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
    port: 1234,
    mockedMethods = [
        'get',
        'post',
        'put',
        'patch',
        'delete',
        // 'head'
    ]
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

### upcoming features
proxy recording

### curl example
#### before / setUp
``` bash
echo '{
    "location": {"longitude": 89.582, "latitude": 99.1351},
    "zipId": "19900135",
    "ssd": {},
    "connection": {"wifiStatus": "OK", "radioStatus": "HIGH"}
      }
' | curl -X POST --header "Content-Type:application/json" -d @- http://localhost:3081/mock/configure/environment/200
```

#### test / action that triggers the call
``` bash
curl http://localhost:3081/api/v1/environment
```

#### after / tearDown
``` bash
curl -X DELETE http://localhost:3081/mock/configure
```

### used/liked
                *  express
                *  (https://github.com/icholy/ttygif)