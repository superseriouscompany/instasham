const request = require('request-promise')
const baseUrl = 'http://localhost:4200'

const api = request.defaults({
  baseUrl: baseUrl,
  json: true,
  resolveWithFullResponse: true,
});

api.baseUrl = baseUrl
module.exports = api
