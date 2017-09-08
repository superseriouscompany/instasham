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
})
