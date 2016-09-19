/**
 * Created by matthew.sanders on 7/22/16.
 */
controllers.controller('socketCtrl', ['$scope','$q','$window','model','particles',
  function ($scope,$q,$window,model,particles) {
    $scope.model = model;
    $scope.title = 'Sockets!';
    $scope.messages = [];
    $scope.users = [];
    $scope.message = '';
    $scope.commands = ['Game Init'];
    var socket = io();

    $scope.getConnectedUsers = function(){
     socket.emit('getUsers', socket.id);
     // $scope.$digest();
    };

    $scope.sendMessage = function(){
      socket.emit('send-message', socket.id + ': ' + $scope.message );
    };
    
    
    $scope.issueCommand = function(cmd){
      var _cmd = {id:socket.id,command:cmd};
      $scope.commands.push(_cmd);
      socket.emit('issue-command', _cmd) ;
    };


    /**
     * Socket on
     */

    socket.on('user-connected',function(id){
      var _id = id.substr(2,id.length);
      if(_.indexOf($scope.users,_id)<0){
        $scope.users.push(_id);
        if(!$scope.particlesInit){
          $scope.initParticles();
        }
        $scope.$digest();
      }

      $scope.getConnectedUsers();
    });

    socket.on('user-disconnected',function(id){
      $scope.users.splice($scope.users.indexOf(id),1);
      $scope.$digest();
      if(id != socket.id){
        particles.removeParticle($scope, id);
      }
    });

    socket.on('getUsersHandler', function(users){
      $scope.users = [];
      _.each(users,function(user){
        user = user.substr(2,user.length);
        $scope.users.push(user);
        if(!$scope[user]){
          $scope.otherParticles(user);
        }
      });
      $scope.$digest();
    });

    socket.on('chat-message',function(msg){
      $scope.messages.push(msg);
      $scope.$digest();
    });

    socket.on('game-command',function(cmd){
      $scope.commands.push(cmd);
      if($scope.updateMove){
        $scope.updateMove(cmd,socket);
      }
      $scope.$digest();
    });

    $scope.initParticles = function(){
      $scope.particlesInit = particles.init($scope);
    };

    $scope.otherParticles = function(){
       particles.addParticle($scope);
    };




  }]);