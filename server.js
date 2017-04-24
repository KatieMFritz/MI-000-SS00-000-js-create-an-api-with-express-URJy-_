var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var port = process.env.PORT || 8080
var todos = require('./todos.js')

app.get('/', function (request, response) {
  response.json({
    welcome: 'Let\'s get sh*t done!'
  })
})

app.get('/todos', function (request, response) {
  response.json(todos)
})

app.post('/todos', function (request, response) {
  var slug = request.body.task.trim().toLowerCase().split(' ').join('-')
  todos[slug] = {
    task: request.body.task.trim(),
    complete: request.body.complete
  }
  response.redirect('/todos/' + slug)
})

app.get('/todos/:slug', function (request, response) {
  if (!todos[request.params.slug]) {
    response.status(404).end('sorry, no such task: ' + request.params.slug)
    return
  }
  response.json(todos[request.params.slug])
})

app.delete('/todos/:slug', function (request, response) {
  delete todos[request.params.slug]
  response.redirect('/todos')
})

app.put('/todos/:slug', function (request, response) {
  var todo = todos[request.params.slug]
  if (request.body.task) {
    todo.task = request.body.task.trim()
  }
  response.redirect('/todos')
})

app.use(function (request, response, next) {
  response.status(404).end(request.url + ' not found')
})

app.listen(port)
