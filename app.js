/**
 * Created by matthew.sanders on 3/13/14.
 */
var config = require('config');
var fs = require('fs');
var http = require('http');
var express = require('express');
var schedule = require('node-schedule');
var socket;


/**
 * allowCrossDomain
 * @param req
 * @param res
 * @param next
 */
var allowCrossDomain = function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

var app = express();
var server = http.createServer(app);
var store = new express.session.MemoryStore;
var io = require('socket.io').listen(server);
    io.on('connection', function (socket) {
      console.log('a user connected');

      socket.on('disconnect',function(){
        console.log('user disconnected');
      });
      socket.on('gameCommand',function(command){
        console.log('command: ' + command);
//        socket.emit('gameCommand',command);
        socket.broadcast.emit('gameCommand',command);
      });
      socket.emit('news', { hello: 'user!' });

      socket.on('chat message', function(msg){
        console.log('message: ' + msg);
      });

      socket.on('my other event', function (data) {
        console.log(data);
      });
    });

app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());
app.use(express.cookieParser());
app.use(express.session({secret:'secret', cookie:{maxAge:config.session.maxAge}, store:store})); //TODO: store sessions in couch
app.use(express.static('src'));
app.use(allowCrossDomain);
app.use(app.router);

app.options('/*', function(req, res){
  res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
  res.send(200);
});


// Load all other routes
fs.readdirSync(__dirname + '/routes').forEach(function(file) {
  require('./routes/' + file)(app,socket);
});


//Load Scheduled Tasks
fs.readdirSync(__dirname + '/schedule').forEach(function(file){
  require('./schedule/' + file)(app,schedule);
});

var port = process.env.PORT || 8081;
var env = process.env.NODE_ENV || 'Localdev';
server.listen(port, function() {
  console.log('PORT: ', port, ' ENV: ', env);
});
