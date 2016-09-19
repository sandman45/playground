/**
 * Created by matthew.sanders on 9/13/16.
 */
var app = angular.module('playGroundApp');

app.factory('particles', function(){
  var particles = {};

  particles.init = function($scope){

    var inWidth = document.getElementById("particleFun").clientWidth;
    var inHeight = document.getElementById("particleFun").clientHeight;
    var width = Math.max(960, inWidth),
        height = Math.max(500, inHeight);

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
    
    return true;
  };
  
  
  particles.addParticle = function ($scope,id) {
    $scope[id] = {};
    var width = Math.max(960, innerWidth),
      height = Math.max(500, innerHeight);

    var x2 = width/3,
      y2 = width/3,
      xa = x2,
      ya = y2,
      i = 0,
      r = 200,
      τ = 2 * Math.PI;

    $scope[id].context = $scope.canvas.node().getContext("2d");
    $scope[id].context.globalCompositeOperation = "lighter";
    $scope[id].context.lineWidth = 2;

    d3.timer(function () {
      $scope[id].context.clearRect(0, 0, width, height);

      var z = d3.hsl(++i % 360, 1, .5).rgb(),
        c = "rgba(" + z.r + "," + z.g + "," + z.b + ",",
        xx = xa += (x2 - xa) * .1,
        yy = ya += (y2 - ya) * .1;

      d3.select({}).transition()
        .duration(3000)
        .ease(Math.sqrt)
        .tween("circle", function () {
          return function (t) {
            $scope[id].context.strokeStyle = c + (1 - t) + ")";
            $scope[id].context.beginPath();
            $scope[id].context.arc(xx, yy, r * t, 0, τ);
            $scope[id].context.stroke();
          };
        });
    });

    $scope.updateMove = function (cmd,socket) {
      if(cmd.id != socket.id){
        x2 = cmd.command[0];
        y2 = cmd.command[1];
      }
    };

  };

  particles.removeParticle = function($scope,id){
    delete $scope[id];
  };


return particles;

});