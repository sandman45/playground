/**
 * Created by matthew.sanders on 7/25/16.
 */
var _ = require('lodash');


module.exports.listen = function(io,socket){

  socket.on('disconnect',function(){
    console.log('User Disconnected: ' + socket.id);
    io.emit('user-disconnected',socket.id);
  });

  socket.on('getUsers', function(){
    console.log('User: ' + socket.id + ', Requesting getUsers');
    var users = [];
    _.each(socket.nsp.connected, function(user){
      users.push(user.id);
    });
    console.log('Emitting Users: ' + users.length);
    io.emit('getUsersHandler',users);
  });


};