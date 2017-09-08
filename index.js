const express    = require('express')
const bodyParser = require('body-parser')
const app        = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.disable('etag')

app.get('/', function(req, res) {
  res.json({version: 1})
})
app.get('/stub/echo', echo)

app.get('/accounts/login', authorize)
app.get('/oauth/authorize', redirect)
app.post('/oauth/access_token', grantToken)

function authorize(req, res) {
  res.redirect(unescape(req.query.next))
}

function redirect(req, res) {
  res.redirect(req.query.redirect_uri + `?code=CODE&state=${req.query.state}`)
}

function grantToken(req, res) {
  if( !req.body.client_id ) { return res.status(400).json({error: 'No client_id provided'})}
  if( !req.body.grant_type ) { return res.status(400).json({error: 'No grant_type provided'})}
  if( !req.body.redirect_uri ) { return res.status(400).json({error: 'No redirect_uri provided'})}
  if( !req.body.code ) { return res.status(400).json({error: 'No code provided'})}

  res.json({
    access_token: 'ACCESSTOKEN',
    user: {
      id:        'ID',
      username:  'sanchopanza',
      full_name: 'Sancho Panza',
    }
  })
}

function echo(req, res) {
  res.json(req.query)
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
