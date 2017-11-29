const express    = require('express')
const bodyParser = require('body-parser')
const app        = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.disable('etag')

app.get('/', function(req, res) {
  res.json({version: 1})
})
app.get('/stub/echo', echo)

app.get('/accounts/login', authorize)
app.get('/oauth/authorize', redirect)
app.post('/oauth/access_token', grantToken)
app.get('/v1/users/self/media/recent', auth, media)

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
      counts: {
        follows:     20,
        followed_by: 400,
        media:       1000,
      }
    }
  })

  // actual response
  // {
  //   access_token: 'REDACTED',
  //   user:
  //    { id: '18172731',
  //      username: 'neilsarkar',
  //      profile_picture: 'https://scontent.cdninstagram.com/t51.2885-19/s150x150/14334292_605067389680708_387372332_a.jpg',
  //      full_name: 'Neil Sarkar',
  //      bio: 'Pretty much just post a photo that\'s primarily water or sky and I will like it.',
  //      website: 'https://itunes.apple.com/app/apple-store/id1212152764?pt=2012320&ct=ns&mt=8',
  //      is_business: false
  //    }
  //  }
}

function echo(req, res) {
  res.json(req.query)
}

function auth(req, res, next) {
  if( !req.query.access_token ) { return res.status(401).json({error: 'No access token provided'}) }
  next()
}

function media(req, res, next) {
  // Reference:
  // https://www.instagram.com/developer/endpoints/users/#get_users_media_recent_self

  res.json({
    data: [
      makeMedia(),
      makeMedia(),
      makeMedia(),
      makeMedia(),
      makeMedia(),
      makeMedia(),
    ]
  })
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

function makeMedia(props) {
  return Object.assign({}, {
    id:        +new Date + '',
    comments:  { count: 0 },
    likes:     { count: 66 },
    created_time: (+new Date / 1000) + '',
    images: {
      standard_resolution: {
        url: 'https://placehold.it/612x612',
        width: 612,
        height: 612,
      },
      low_resolution: {
        url: 'https://placehold.it/306x306',
        width: 306,
        height: 306,
      },
      thumbnail: {
        url: 'https://placehold.it/150x150',
        width: 150,
        height: 150,
      }
    }
  }, props)
}
