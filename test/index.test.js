global.TEST_MODE = true
const expect     = require('expect')
const server     = require('../index')
const api        = require('./api')

describe('api', function() {
  var serverHandle, dynamoProcess
  this.slow(1000)
  this.timeout(5000)

  before(function() {
    serverHandle = server(4200)
  })

  after(function() {
    serverHandle()
  })

  it("responds to health check", function () {
    return api('/').then((r) => {
      expect(r.statusCode).toEqual(200)
      expect(r.body.version).toEqual(1)
    })
  })

  it("redirects properly from login", function () {
    return api('/accounts/login/?force_classic_login=&next=/oauth/authorize/%3Fclient_id%3DCLIENTID%26redirect_uri%3Dhttp%3A//localhost%3A4200/stub/echo%26response_type%3Dcode%26state%3Dclient.ios').then((r) => {
      expect(r.body.code).toEqual('CODE')
      expect(r.body.state).toEqual('client.ios')
    })
  });
})
