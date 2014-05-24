/**
 * Created by matthew.sanders on 5/2/14.
 */
controllers.controller('dotDotCtrl', ['$scope','$q',
  function ($scope,$q) {
    $scope.title = "Dot Dot!";
    $scope.startGame = start;
    $scope.clearGame = reset;
//    $scope.showStart = false;

    //-- player variables ---------------------
    $scope.player1 = {
      i:0,
      player:"",
      color:"orange",
      score:0,
      classes:{active:true}
    };
    $scope.player2 = {
      i:1,
      player:"",
      color:"purple",
      score:0,
      classes:{active:false}
    };
    $scope.players=[];

    var currentTurnIndex=0;
    var current_turn;
    //-- game variables -------------------------
    var spacing = 10;
    var grid = [8,8];
    var nodeCount = grid[0]*grid[1];
    var gridCoordinates = [];
    var scoringMatrix =[];
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

    /**
     * boxValidator
     * @param id
     * @returns {promise|*|Function|promise}
     */
    function boxValidator(id){
      var Q = $q.defer();
      var allLines = d3.selectAll('line');
      if(allLines[0].length>4){
        var coord1 = 0;
        var coord2 = 1;
        var coord3 = 9;
        var coord4 = 8;
        var line1,line2,line3,line4;
        for(var k=0;k<7;k++){
          coord1 = 0 + (k*grid[0]);
          coord2 = 1 + (k*grid[0]);
          coord3 = 9 + (k*grid[0]);
          coord4 = 8 + (k*grid[0]);
          line1=null,line2=null,line3=null,line4=null;
          for(var j=0;j<7;j++){
            //console.log("checking column: "+k+" row: "+j);
            if(j!=0){
              coord1 = coord1+1;
              coord2 = coord2+1;
              coord3 = coord3+1;
              coord4 = coord4+1;
            }

            try{line1 = d3.select('#dots_'+coord1+'-'+'dots_'+coord2).attr('id');}catch(err){line1=null;}
            try{line2 = d3.select('#dots_'+coord2+'-'+'dots_'+coord3).attr('id');}catch(err){line2=null;}
            try{line3 = d3.select('#dots_'+coord4+'-'+'dots_'+coord3).attr('id');}catch(err){line3=null;}
            try{line4 = d3.select('#dots_'+coord1+'-'+'dots_'+coord4).attr('id');}catch(err){line4=null;}
            if(line1&&line2&&line3&&line4){
              if(scoringMatrix[k][j].id==""){
                createBox(coord1);
                $scope.players[currentTurnIndex].score++;
                $scope.$apply();
                scoringMatrix[k][j].id = "box"+coord1;
                scoringMatrix[k][j].player = current_turn.player;
                Q.resolve("Player Scores, created box.. take another turn");
              }
            }
          }
        }
        Q.reject("No Box created");
      }else{
        Q.reject("No Box created");
      }
      return Q.promise;
    }

    /**
     * finishTurn
     */
    function finishTurn(lineID){

      //check to see if a box needs to be created.
      boxValidator(lineID).then(function(data){
        console.log(data);
      })
      .catch(function(response){
        console.log(response);
          currentTurnIndex++;
          if(currentTurnIndex>$scope.players.length-1){
            currentTurnIndex=0;
          }
          current_turn = $scope.players[currentTurnIndex];
          _.forEach($scope.players,function(player){
            player.classes.active = false;
          });
          $scope.players[currentTurnIndex].classes.active = true;

      });
    }

    /**
     * initScoringMatrix
     */
    function initScoringMatrix(){
      for(var i=0;i<grid[0];i++){
        scoringMatrix.push([]);
        for(var j=0;j<grid[0];j++){
          scoringMatrix[i].push({id:"",player:""});
        }
      }
    }

    /**
     * start
     */
    function start(){
      $scope.players = [];
      initScoringMatrix();
      $scope.players.push($scope.player1);
      $scope.players.push($scope.player2);
      current_turn = $scope.players[currentTurnIndex];

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
    /**
     * reset
     */
    function reset(){
      svg.selectAll("circle").remove();
      svg.selectAll("line").remove();
      svg.selectAll("rect").remove();
      svg.select("#players").remove();
      nodes = [];
      links = [];
      scoringMatrix = [];
      i = 0;
      currentTurnIndex = 0;
      current_turn = $scope.players[currentTurnIndex];
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
        .attr('id','dots_'+i)
        .attr("r", r1)
        .transition()
        .ease(Math.sqrt)
        .attr("r", r2);
    }

    /**
     * createBox
     */
    function createBox(coord){
      var xCoor = parseFloat(d3.select("#dots_"+coord).attr('cx'))+2.5;
      var yCoor = parseFloat(d3.select("#dots_"+coord).attr('cy'))+2.5;
      var data = {x:xCoor,y:yCoor,player:current_turn.player,color:current_turn.color};
      console.log("create box for "+data.player);
      svg.append("rect")
        .attr("id",data.player+"_box")
        .attr("class","my class")
        .attr("fill",data.color)
        .attr("x", xCoor)
        .attr("y", yCoor)
        .attr("width",50)
        .attr("height",50)
        .attr("opacity", 0)
        .transition()
        .ease(Math.sqrt)
        .attr("opacity",1);
    }
    /**
     * dragLine
     * @param node
     */
    function dragLine(node) {
      if (!mousedown_node) return;
      drag_line
        .attr("x1", mousedown_node.x)
        .attr("y1", mousedown_node.y)
        .attr("x2", d3.mouse(node)[0])
        .attr("y2", d3.mouse(node)[1]);
    }
    /**
     * valid
     * @param node
     * @returns {boolean}
     */
    function valid(node){
      xDiff = Math.abs(mousedown_node.x-d3.select(node).attr('cx'));
      yDiff = Math.abs(mousedown_node.y-d3.select(node).attr('cy'));
      console.log('xdiff: '+xDiff+',ydiff:'+yDiff);
      if((xDiff<60&&yDiff<1)||(xDiff<1&&yDiff<60)){
        return true;
      }
      return false;
    }

    /**
     * drawLine
     * @param source
     */
    function drawLine(source){
      console.log("draw line from x1,y1: "+mousedown_node.x+","+mousedown_node.y+" to x2,y2: "+d3.select(source).attr('cx')+","+d3.select(source).attr('cy'));
      var id;
      var id1 = parseFloat(mousedown_node.id.substr(5,mousedown_node.id.length));
      var id2 = parseFloat(d3.select(source).attr('id').substr(5,d3.select(source).attr('id').length));
      if(id1<id2){
        id = mousedown_node.id+"-"+d3.select(source).attr('id');
      }else{
        id = d3.select(source).attr('id')+"-"+mousedown_node.id;
      }
      svg.append("line")
        .attr("player",current_turn.player)
        .attr("class",current_turn.player)
        .attr("id",id)
        .attr("stroke",current_turn.color)
        .attr("x1", mousedown_node.x)
        .attr("y1", mousedown_node.y)
        .attr("x2", d3.select(source).attr('cx'))
        .attr("y2", d3.select(source).attr('cy'));
      finishTurn(id);
      mousedown_node=null;
    }
    /**
     * layout
     */
    function layout(){
      force.on('tick',function(){});
      svg.on('mousemove',function(){
        dragLine(this);
      });
      svg.on('mouseup',function(){
        drag_line
          .attr("class", "drag_line_hidden");
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
          mousedown_node = {x:d3.select(this).attr('cx'),y:d3.select(this).attr('cy'),id:d3.select(this).attr('id')};
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
    /**
     * createGridCoords
     */
    function createGridCoords(){
      for(var i=0;i<grid[0];i++){
        for(var j=0;j<grid[1];j++){
          gridCoordinates.push({x:i*spacing,y:j*spacing});
        }
      }
    }
  }]);