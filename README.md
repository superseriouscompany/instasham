# Instasham

This is a very early, feature poor instagram stub server for use in your testing environments.

## Features

1. OAuth flow authentication for hardcoded user
1. Hardcoded photos returned

## Usage

```js
const handle  = require('instasham')(4200)
const request = require('request-promise')

const clientId    = 'anything'
const redirectUri = 'http://example.com/webhook'
const state       = 'optional'

request({
  method: 'POST',
  url: 'http://localhost:4200/oauth/access_token',
  form: {
    client_id:     'ANYTHING',
    client_secret: 'ANYTHING',
    grant_type:    'authorization_code',
    redirect_uri:  'ANYTHING',
    code:          'CODE',
  }
}).then((r) => {
  console.log(r)
  // {
  // 	"access_token": "ACCESSTOKEN",
  // 	"user": {
  // 		"id": "ID",
  // 		"username": "sanchopanza",
  // 		"full_name": "Sancho Panza"
  // 	}
  // }  

  return request({
    url: 'http://localhost:4200/v1/users/self/media/recent?access_token=' + r.access_token,
    json: true,
  })  
}).then((r) => {
  console.log(r)
  // {
  // 	"data": [{
  // 		"images": {
  // 			"standard_resolution": "https://placehold.it/640x640"
  // 		}
  // 	}]
  // }

  // shut down instasham server
  handle()
})
```
