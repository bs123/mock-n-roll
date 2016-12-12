<img src="http://openclipart.org/download/28383/Dug-Rock-On.svg" width="10%" height="10%">

# mock-n-roll
configurable rest service system mock

## Motivation
* you don't need mock-n-roll for mocking in your Unittest, use [Sinion](http://sinonjs.org/)
* you don't need mock-n-roll for Mocking Http Calls, use network intersections like [nock](https://github.com/node-nock/nock)
* when doing blackbox testing of your client, you may want to use mock-n-roll.

## Demo
>todo

### curl example
#### before / setUp
* you could specify any repsonse body in the post body
* you cold specify any service call as path parameter, here environment, /mock/configure/**environment**/200
* you cold specify any response http code as path parameter, here 200, /mock/configure/environment/**200**

``` bash
echo '{
    "location": {"longitude": 89.582, "latitude": 99.1351},
    "zipId": "19900135",
    "ssd": {},
    "connection": {"wifiStatus": "OK", "radioStatus": "HIGH"}
      }
' | curl -X POST -d @- http://localhost:3081/mock/configure/environment/200 --header "Content-Type:application/json"
```

#### test / action that triggers the call
``` bash
curl http://localhost:3081/api/v1/environment
```

#### after / tearDown
``` bash
curl -X DELETE http://localhost:3081/mock/configure
```

### mock-n-roll.config.js
```javascript
module.exports = {
    vHost: 'your.funny.domain.dev',
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
- [x] cross-env or cli or node standard
- [ ] author
- [ ] SwaggerDoc
- [x] licence
- [x] mxd-eslint

### upcoming features
- [ ] default overrule pathes (feature)
- [ ] proxy recording mode

### used/liked
                *  express
                *  (https://github.com/icholy/ttygif)

``` bash
 $ git commit -a  --author="bs <email>" -m "readme"
```
