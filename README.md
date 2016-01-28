# eq-request

API client for Eq applications

## Example

### GET request
```js
const eq_request = require('eq-request'),
    client = request(),
    url = 'http://localhost:3000/data';

client.get(url, function (error, result) {
    if (error) {
        return done(error);
    }
    
    console.log(result.body);
})
```

### POST request
```js
const eq_request = require('eq-request'),
    client = request(),
    url = 'http://localhost:3000/api',
    data = {
        method: 'test',
        data: {
        }
    };

client.setHeader('Content-Type', 'application/json')
    .client.post(url, data, function (error, result) {
        if (error) {
            return done(error);
        }

        console.log(result.body);
    });
```

### API request

```js
const eq_request = require('eq-request'),
    client = eq_request(),
    api = client.api('http://localhost:3000/api'),
    data = {};

api('test', data, function () {
    if (error) {
        return done(error);
    }
    
    console.log(result.body);
});
```
