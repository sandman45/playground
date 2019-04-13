/**
 * Created by matthew.sanders on 3/13/14.
 */
require('dotenv').config();
const fs = require('fs');
const _ = require('underscore');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');

const cookieSession = require('cookie-session');


/**
 * allowCrossDomain
 * @param req
 * @param res
 * @param next
 */
const allowCrossDomain = function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

const app = express();
const server = http.Server(app);
const io = require('socket.io').listen(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(express.static('src'));
app.use(allowCrossDomain);
// app.use(app.router);

app.options('/*', function(req, res){
  res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
  res.status(200).send(200);
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
  // require('./schedule/' + file)(app,schedule);
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



const port = process.env.PORT || 8081;
const env = process.env.NODE_ENV || 'local';

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
  console.log(`security check => email: ${req.session.email} userid: ${req.session.userid}`);
  // if (req.session) {
  //   if (_.has(req.session, 'username')) {
  //     if (req.session.username === req.session.username) {
        next();
  //     }
  //   } else {
  //     console.log('Forbidden');
  //     req.session = null;
  //     res.status(403).send({message: 'Forbidden'});
  //   }
  // }
  // else {
  //   console.log('Forbidden');
  //   req.session = null;
  //   res.status(403).send({message: 'Forbidden'});
  // }
}
