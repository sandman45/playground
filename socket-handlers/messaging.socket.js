/**
 * Created by matthew.sanders on 7/26/16.
 */
module.exports.listen = function (io,socket) {

  socket.on('send-message',function(msg){

    io.emit('chat-message', msg);

  });




};