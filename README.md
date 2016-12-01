# mock-n-roll
configurable rest service system mock

git commit -a  --author="bs <email>" -m "readme"

TODO:
get rid of connect-*
cross-env or cli
author
default overrule pathes (feature)
PUT,DELETE,PATCH,OPTIONS? (feature)
SwaggerDoc

curl example
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