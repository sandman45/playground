/**
 * Created by matthew.sanders on 7/22/16.
 */
controllers.controller('socketCtrl', ['$scope','$q','$window','model',
  function ($scope,$q,$window,model) {
    $scope.model = model;
    $scope.title = 'Sockets!';
    $scope.messages = [];
    $scope.users = [];
    $scope.message = '';
    var socket = io();

    $scope.getConnectedUsers = function(){
     socket.emit('getUsers', socket.id);
     // $scope.$digest();
    };

    $scope.sendMessage = function(){
      socket.emit('send-message', socket.id + ': ' + $scope.message );
    };

    socket.on('user-connected',function(id){
      $scope.users.push(id);

      $scope.$digest();
    });

    socket.on('user-disconnected',function(id){
      $scope.users.splice($scope.users.indexOf(id),1);
      $scope.$digest();
    });

    socket.on('getUsersHandler', function(users){
      $scope.users = users;
      $scope.$digest();
    });

    socket.on('chat-message',function(msg){
      $scope.messages.push(msg);
      $scope.$digest();
    });
    

    $scope.getConnectedUsers();
    
  }]);