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

    socket.on('game-command',function(cmd){
      $scope.commands.push(cmd);
      $scope.updateMove(cmd);
      $scope.$digest();
    });


    $scope.getConnectedUsers();

    //
    // $scope.initCanvas = function(){
    //
    //   $scope.svg = d3.select('#particleFun').append('svg')
    //     .attr('width',500)
    //     .attr('height',300);
    //
    //     $scope.svg.append('circle')
    //       .style("stroke", "pink")
    //       .style("fill", "blue")
    //       .attr("r", 40)
    //       .attr("cx", 50)
    //       .attr("cy", 20);
    //
    // };
    //
    // $scope.initCanvas();


    //D3 stuff move to another file

    $scope.initParticles = function(){

      var width = Math.max(960, innerWidth),
        height = Math.max(500, innerHeight);

      var x1 = width / 2,
        y1 = height / 2,
        x0 = x1,
        y0 = y1,
        i = 0,
        r = 200,
        τ = 2 * Math.PI;

      $scope.canvas = d3.select("#particleFun").append("canvas")
        .attr("width", width)
        .attr("height", height)
        .on("ontouchstart" in document ? "touchmove" : "mousemove", move);

      $scope.context = $scope.canvas.node().getContext("2d");
      $scope.context.globalCompositeOperation = "lighter";
      $scope.context.lineWidth = 2;

      d3.timer(function() {
        $scope.context.clearRect(0, 0, width, height);

        var z = d3.hsl(++i % 360, 1, .5).rgb(),
          c = "rgba(" + z.r + "," + z.g + "," + z.b + ",",
          x = x0 += (x1 - x0) * .1,
          y = y0 += (y1 - y0) * .1;

        d3.select({}).transition()
          .duration(2000)
          .ease(Math.sqrt)
          .tween("circle", function() {
            return function(t) {
              $scope.context.strokeStyle = c + (1 - t) + ")";
              $scope.context.beginPath();
              $scope.context.arc(x, y, r * t, 0, τ);
              $scope.context.stroke();
            };
          });
      });

      function move() {
        var mouse = d3.mouse(this);
        x1 = mouse[0];
        y1 = mouse[1];
        d3.event.preventDefault();
        $scope.issueCommand(mouse);
      }
    };

    $scope.otherParticles = function(){

        var width = Math.max(960, innerWidth),
          height = Math.max(500, innerHeight);

        var x2 = width/3,
          y2 = width/3,
          xa = x2,
          ya = y2,
          i = 0,
          r = 200,
          τ = 2 * Math.PI;

      $scope.context2 = $scope.canvas.node().getContext("2d");
      $scope.context2.globalCompositeOperation = "lighter";
      $scope.context2.lineWidth = 2;

        d3.timer(function () {
          $scope.context2.clearRect(0, 0, width, height);

          var z = d3.hsl(++i % 360, 1, .5).rgb(),
            c = "rgba(" + z.r + "," + z.g + "," + z.b + ",",
            xx = xa += (x2 - xa) * .1,
            yy = ya += (y2 - ya) * .1;

          d3.select({}).transition()
            .duration(3000)
            .ease(Math.sqrt)
            .tween("circle", function () {
              return function (t) {
                $scope.context2.strokeStyle = c + (1 - t) + ")";
                $scope.context2.beginPath();
                $scope.context2.arc(xx, yy, r * t, 0, τ);
                $scope.context2.stroke();
              };
            });
        });

        $scope.updateMove = function (cmd) {
          if(cmd.id != socket.id){
            x2 = cmd.command[0];
            y2 = cmd.command[1];
          }
        };
    };
    
    $scope.initParticles();
    $scope.otherParticles();

  }]);