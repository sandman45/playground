/**
 * Created by matthew.sanders on 3/13/14.
 */
var config = require('config');
var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var session = require('express-session');
    connect = require('connect');
    ConnectCouchDB = require('connect-couchdb')(session);


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
var server = http.Server(app);
var io = require('socket.io').listen(server);

var store = new ConnectCouchDB({
  //Name of Database for session storage
  name: 'sessions',
  //How often  expired sessions should be cleaned up
  host:config.couch.url,
  reapInterval: config.session.reapInterval,
  compactInterval:config.session.compactInterval,
  setThrottle: config.session.throttle
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


// app.use(express.cookieParser());
app.use(session({
  secret:'myAmazingSecret',
  store:store,
  cookie:{maxAge:config.session.cookie.maxAge}
}));
app.use(express.static('src'));
app.use(allowCrossDomain);
// app.use(app.router);

app.options('/*', function(req, res){
  res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
  res.send(200);
});

//-- require all routes in playground directory to run security check
app.all("/playground/*", securityCheck, function(req, res, next){
  next();
});


// Load all other routes
fs.readdirSync(__dirname + '/routes').forEach(function(file) {
  require('./routes/' + file)(app);
});


//Load Scheduled Tasks
fs.readdirSync(__dirname + '/schedule').forEach(function(file){
  require('./schedule/' + file)(app,schedule);
});

//Socket Stuff!!!
io.sockets.on('connection', function(socket){
  console.log('User Connected:' + socket.id);
  //get user info?
  socket.user = {name:'user 2'};
  io.emit('user-connected',socket.id);
  
  fs.readdirSync(__dirname + '/socket-handlers').forEach(function(file){
    require('./socket-handlers/' + file).listen(io,socket);
  });
});

var port = process.env.PORT || 8081;
var env = process.env.NODE_ENV || 'default';
server.listen(port, function() {
  console.log('PORT: ', port, ' ENV: ', env);
});



//---functions------
/**
 * securityCheck
 * @param req
 * @param res
 * @param next
 */
function securityCheck(req, res, next) {
  store.get(req.session.id, function (err, session) {
    if (err) {
      res.status(500).send({message: err});
    }
    if (session) {
      if (_.has(session, 'username')) {
        if (session.username == req.session.username) {
          next();
        }
      } else {
        console.log('Forbidden');
        req.session = null;
        res.status(403).send({message: 'Forbidden'});
      }
    }
    else {
      console.log('Forbidden');
      req.session = null;
      res.status(403).send({message: 'Forbidden'});
    }
  });
}
