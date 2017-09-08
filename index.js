const express    = require('express')
const bodyParser = require('body-parser')
const app        = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.disable('etag')

app.get('/', function(req, res) {
  res.json({version: 1})
})

app.get('/accounts/login', authorize)
app.get('/oauth/authorize', redirect)

function authorize() {

}

function redirect() {

}


app.use(function(err, req, res, next) {
  console.error({err: err, message: err.message, errName: err.name, stack: err.stack}, 'Uncaught server error');
  res.status(500).json({message: 'Something went wrong.'});
})

if( process.env.NODE_ENV != 'production' && module.parent ) {
  module.exports = function(port) {
    const ref    = app.listen(port)
    const handle = ref.close.bind(ref)
    return handle
  }
  return
}

app.listen(port, function() {
  console.log(`Listening on ${port}...`)
})
