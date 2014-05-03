/**
 * Created by matthew.sanders on 5/2/14.
 */
controllers.controller('dotDotCtrl', ['$scope',
  function ($scope) {
    $scope.title = "Dot Dot!";
    $scope.startGame = start;
//    $scope.showStart = false;
    var spacing = 4;
    var grid = [4,4];
    var nodeCount = grid[0]*grid[1];
    var gridCoordinates = [];
    var svg;
    var svgWidth = 1024;
    var svgHeight = 400;
    var margins={top:70,bottom:20,left:70,right:20};
    var h=svgHeight-(margins.top+margins.bottom),w=svgWidth-(margins.left+margins.right);
    var nodes = [];
    var i = 0;

    var xScale  = d3.scale.linear().domain([0,spacing*grid[0]]).range([margins.left,w]);
    var yScale  = d3.scale.linear().domain([0,spacing*grid[1]]).range([margins.top,h]);

    var force = d3.layout.force()
      .charge(-20)
      .size([w, h])
      .nodes(nodes)
      .on("tick", tick)
      .start();

    init();

    /**
     * tick
     */
    function tick() {
      svg.selectAll("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }
    /**
     * init
     */
    function init() {
      createGridCoords();
      svg = d3.select('#dotDotContainer').append('svg').attr('height', h).attr('width', w).style('background','gray');


    }
    function start(){
      var interval = setInterval(function() {
        var d = {
          x: w / 2 + 2 * Math.random() - 1,
          y: h / 2 + 2 * Math.random() - 1,
          index:i
        };

        if(i<nodeCount){
          createDot(i,d,1e-6,5);
          nodes.push(d)
          i++;
        }else{
          setTimeout(function(){
            force.stop();
            clearInterval(interval);
            console.log('end force');
            layout();
          },2000);
        }
        if(force){
          force.start();
        }
      }, 50);
    }

    /**
     * createDot
     * @param i - index of dot
     * @param x - x location
     * @param y - y location
     * @param r - radius of dot
     */
    function createDot(i,d,r1,r2){
      svg.append('svg:circle')
        .data([d])
        .attr('id','#dots_'+i)
        .attr("r", r1)
        .transition()
        .ease(Math.sqrt)
        .attr("r", r2);

    }
    function layout(){
      force.on('tick',function(){});
      svg.selectAll('circle')
        .attr('cursor','pointer')
        .on('mouseover',function(){
          d3.select(this).style('opacity',.5);
          d3.select(this).attr('r',7);
        })
        .on('mouseout',function(){
          d3.select(this).style('opacity',1);
          d3.select(this).attr('r',5);
        })
        .attr("cx", function(d,i) {
          return d.x;
        })
        .attr("cy", function(d,i) {
          return d.y;
        })
        .transition()
        .ease(Math.sqrt)
        .duration(2000)
        .attr("cx", function(d) {
          return xScale(gridCoordinates[d.index].x);
        })
        .attr("cy", function(d) {
          return yScale(gridCoordinates[d.index].y);
        });
    }

    function createGridCoords(){
      for(var i=0;i<grid[0];i++){
        for(var j=0;j<grid[1];j++){
          gridCoordinates.push({x:i*spacing,y:j*spacing});
        }
      }
    }
  }]);