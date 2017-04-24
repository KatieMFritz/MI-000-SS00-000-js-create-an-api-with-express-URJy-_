var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var port = process.env.PORT || 8080
var entries = require('./entries.js')

app.get('/', function (request, response) {
  response.json({
    welcome: 'Budgets are helpful!'
  })
})

app.get('/entries', function (request, response) {
  response.json(entries)
})

app.post('/entries', function (request, response) {
  var slug = request.body.name.trim().toLowerCase().split(' ').join('-')
  entries[slug] = {
    name: request.body.name.trim(),
    amount: '$' + parseFloat(request.body.amount).toFixed(2),
    type: request.body.type
  }
  response.redirect('/entries/' + slug)
})

app.get('/entries/:slug', function (request, response) {
  if (!entries[request.params.slug]) {
    response.status(404).end('sorry, no such entry: ' + request.params.slug)
    return
  }
  response.json(entries[request.params.slug])
})

app.delete('/entries/:slug', function (request, response) {
  delete entries[request.params.slug]
  response.redirect('/entries')
})

app.put('/entries/:slug', function (request, response) {
  var entry = entries[request.params.slug]
  if (request.body.name) {
    entry.name = request.body.name.trim()
  }
  if (request.body.amouont) {
    entry.amount = '$' + parseFloat(request.body.amount).toFixed(2)
  }
  response.redirect('/entries')
})

app.use(function (request, response, next) {
  response.status(404).end(request.url + ' not found')
})

app.use(function (request, response, next) {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT')
  response.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.listen(port)
