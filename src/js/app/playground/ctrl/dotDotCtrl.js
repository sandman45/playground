/**
 * Created by matthew.sanders on 5/2/14.
 */
controllers.controller('dotDotCtrl', ['$scope',
  function ($scope) {
    $scope.title = "Dot Dot!";
    $scope.startGame = start;
    $scope.clearGame = reset;
//    $scope.showStart = false;

    //-- player variables ---------------------
    var players = [
      {
        i:0,
        player:"Matt",
        color:"orange",
        score:0
      },
      {
        i:1,
        player:"Libby",
        color:"purple",
        score:0
      }];
    var currentTurnIndex=0;

    var current_turn = players[currentTurnIndex];
    //-- game variables -------------------------
    var spacing = 10;
    var grid = [8,8];
    var nodeCount = grid[0]*grid[1];
    var gridCoordinates = [];
    var svg;
    var drag_line;
    var svgWidth = 500;
    var svgHeight = 500;

    var margins={top:50,bottom:0,left:50,right:0};
    var h=svgHeight-margins.bottom,
        w=svgWidth-margins.right;
    var nodes = [];
    var links = [];
    var i = 0;

    var xScale  = d3.scale.linear().domain([0,spacing*grid[0]]).range([margins.left,w]);
    var yScale  = d3.scale.linear().domain([0,spacing*grid[1]]).range([margins.top,h]);

    var force = d3.layout.force()
      .charge(-20)
      .size([w, h])
      .nodes(nodes)
      .links(links)
      .on("tick", tick)
      .start();


    var mousedown_node = null;
    var mouseup_node = null;
    var mousedown_link = null;
    var selected_node = null;
    var selected_link = null;
    // line displayed when dragging new nodes



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

      var playerCont = d3.select("#players").append('svg').attr('height', 25).attr('width', w).style('background','lightblue');
      var text = playerCont.selectAll("text").data(players).enter().append("text");
      var textLabel = text
                       .attr("x", function(d) { return d.i*150; })
                       .attr("y", function(d) { return 15; })
                       .text( function (d) { return "" + d.player + ": ( "+ d.score+" )"; })
                       .attr("font-family", "sans-serif")
                       .attr("font-size", "12px")
                       .attr("fill", "black");



    }
    function finishTurn(){
      currentTurnIndex++;
      if(currentTurnIndex>players.length-1){
        currentTurnIndex=0;
      }
      current_turn = players[currentTurnIndex];
    }
    function start(){
      drag_line = svg.append("line")
        .attr("class", "drag_line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", 0);
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
    function reset(){
      svg.selectAll("circle").remove();
      svg.selectAll("line").remove();
      nodes = [];
      links = [];
      i = 0;
      currentTurnIndex = 0;
      current_turn = players[currentTurnIndex];
      force.start();
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

    function dragLine(node) {
      if (!mousedown_node) return;
      drag_line
        .attr("x1", mousedown_node.x)
        .attr("y1", mousedown_node.y)
        .attr("x2", d3.mouse(node)[0])
        .attr("y2", d3.mouse(node)[1]);
    }

    function valid(node){
      xDiff = Math.abs(mousedown_node.x-d3.select(node).attr('cx'));
      yDiff = Math.abs(mousedown_node.y-d3.select(node).attr('cy'));
      console.log('xdiff: '+xDiff+',ydiff:'+yDiff);
      if((xDiff<60&&yDiff<1)||(xDiff<1&&yDiff<60)){
        return true;
      }
      return false;
    }

    function drawLine(source){
      console.log("draw line from x1,y1: "+mousedown_node.x+","+mousedown_node.y+" to x2,y2: "+d3.select(source).attr('cx')+","+d3.select(source).attr('cy'));
      svg.append("line")
        .attr("player",current_turn.player)
        .attr("class",current_turn.player)
        .attr("stroke",current_turn.color)
        .attr("x1", mousedown_node.x)
        .attr("y1", mousedown_node.y)
        .attr("x2", d3.select(source).attr('cx'))
        .attr("y2", d3.select(source).attr('cy'));
      mousedown_node=null;
      finishTurn();
    }

    function layout(){
      force.on('tick',function(){});
      svg.on('mousemove',function(){
        dragLine(this);
      });
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
        .on('mousedown',function(){
          var dot = this;
          mousedown_node = {x:d3.select(this).attr('cx'),y:d3.select(this).attr('cy')};
          if (mousedown_node == selected_node) selected_node = null;
          else selected_node = mousedown_node;
          selected_link = null;

          console.log('node x: '+mousedown_node.x + ", node y: "+mousedown_node.y);
          // reposition drag line
          drag_line
            .attr("class", "link")
            .attr("x1", mousedown_node.x)
            .attr("y1", mousedown_node.y)
            .attr("x2", mousedown_node.x)
            .attr("y2", mousedown_node.y);
        })
        .on("mouseup",function() {
          if(valid(this)){
            drawLine(this);
            drag_line
              .attr("class", "drag_line_hidden");
          }else{
            drag_line
              .attr("class", "drag_line_hidden");
          }
        })
        .on('click',function(){

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