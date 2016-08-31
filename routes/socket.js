/**
 * Created by matthew.sanders on 6/17/14.
 */

// var socketio = require('socket.io');

module.exports = function(app) {

  // var io = socketio.listen(app,);

  app.get('/getUserList', function(req,res){
    var users = [];

    // var users = io.of('/users');

    res.status(200).send(users);
  });
  app.get('/alive',function(req,res,next){
    res.status(200).send({status:'Alive!'});
  });
};