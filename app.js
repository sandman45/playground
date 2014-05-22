/**
 * Created by matthew.sanders on 3/13/14.
 */
var fs = require('fs');
var http = require('http');
var express = require('express');
var schedule = require('node-schedule');
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

app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());
app.use(express.static('src'));
app.use(allowCrossDomain);

// Load all other routes
fs.readdirSync(__dirname + '/routes').forEach(function(file) {
    require('./routes/' + file)(app);
});

//Load Scheduled Tasks
fs.readdirSync(__dirname + '/schedule').forEach(function(file){
  require('./schedule/' + file)(app,schedule);
});


var port = process.env.PORT || 8081;
server.listen(port, function() {
    console.log('PORT: ', port, ' ENV: ', process.env.NODE_ENV);
});