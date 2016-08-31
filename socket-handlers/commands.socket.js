/**
 * Created by matthew.sanders on 7/26/16.
 */
module.exports.listen = function (io,socket) {

  socket.on('issue-command',function(cmd){

    io.emit('game-command', cmd);

  });




};