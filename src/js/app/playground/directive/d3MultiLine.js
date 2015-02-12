angular.module('playGroundApp').directive('d3MultiLine', [function () {
  function link(scope, el, attrs) {

    /** CHART DIV: DOM Element which houses the line chart */
    var chartDiv = el[0];
    /** WIDTH & HEIGHT: Detects height & width of the CHART DIV */
    var fullH = parseFloat(scope.height) || chartDiv.parentElement.clientHeight || 500;
    var fullW = parseFloat(scope.width) || chartDiv.parentElement.clientWidth || 500;

    /** tm - timeout: delay to redrawing chart after resizing  */
    var tm = null;

    /** CHART DIMENSIONS: Define dimensions of chart */
    var m = {top: scope.marginTop || 40, right: scope.marginRight || 40, bottom: scope.marginBottom || 40, left: scope.marginLeft || 40}; // margins
    var w = fullW - m.left - m.right;
    var h = fullH - m.top - m.bottom;

    /**COLORS**/
    var color = d3.scale.linear();

    if (scope.colorHigh) {
      var colorLow = scope.colorLow || 'black';
      color.range([colorLow, scope.colorHigh]);
    } else if (scope.color) {
      color = function () {
        return scope.color;
      };
    } else {
//      var colorRange = colorUtil.getPaletteRange(scope.colorRange || '#FF8200');
//      color.setRange = function (count) {
//        color.range(colorRange(count));
//      };
    }

    /***Create Tooltip **/
    createToolTip();

    var xScale = d3.time.scale().range([0, w]);
    /** Y SCALE: Places the .domain values from 0-dMax[n] within the .range of pixels from h-0
     * NOTE: .domain is set in animate() function */
    var yScale = d3.scale.linear()
      .range([h, 0]);

    /** DATA POINTS - Returns X & Y coordinate points for plotting the line
     * .x() returns the X coordinate and uses the xScale to place it between pixels 0-w (.range)
     * .y() returns the Y coordinate and uses the yScale[n] to place it between pixels h-0 (.range) */
    var line = d3.svg.line()
      .x(function (d) {
        return xScale(d.x);
      })
      .y(function (d) {
        return yScale(d.y);
      });//.interpolate("basis");

    /** SVG CONTAINER: Creates an SVG element with the desired dimensions and margins and places it in the CHART DIV */
    var svgContainer = d3.select(chartDiv).append('svg')
      .attr('class', 'svg-container')
      .attr('width', '100%')
      .attr('height', h + m.top + m.bottom)
      .append('svg:g')
      .attr('transform', 'translate(' + m.left + ',' + m.top + ')');

    /** animate() function: Animates Lines, X-Axis, Y-Axis; Data Transitions; and Responsive Animations  */
    function animate() {

      if (scope.data.length > 0) {
        updateScale();
        if (scope.showXAxis) {
          svgContainer.selectAll(".x.axis").transition().duration(scope.time).ease("linear").remove();

          var xAxis = d3.svg.axis().scale(xScale).tickSize(2).tickSubdivide(false).tickFormat(d3.time.format("%b-%Y"));

          svgContainer.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (h) + ')')
            .style('opacity', 0);

          svgContainer.select(".x.axis")
            .transition()
            .duration(scope.time)
            .ease("linear")
            .style("opacity", 1)
            .attr("transform", "translate(" + 0 + "," + (h) + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr('transform',function(d){
              return "rotate(-35)";
            });
        }
        if (scope.showYAxis) {
          svgContainer.selectAll(".y.axis.axisLeft").transition().duration(scope.time).ease("linear").remove();

          var yAxisLeft = d3.svg.axis().scale(yScale).ticks(8).tickSize(2).tickPadding(1).orient('left');

          svgContainer.append('svg:g')
            .attr('class', 'y axis axisLeft')
            .attr('transform', 'translate(-15,0)')
            .style({'opacity': 0});

          svgContainer.select(".y.axis.axisLeft").transition()
            .duration(scope.time)
            .ease("linear")
            .style({'opacity': 1})
            .attr("transform", "translate(-15,0 )")
            .call(yAxisLeft);

          svgContainer.selectAll(".y.axis.axisRight").remove();

          svgContainer.selectAll(".y.axis.axisRight").transition().duration(scope.time).ease("linear").remove();

          var yAxisRight = d3.svg.axis().scale(yScale).ticks(8).tickSize(1).orient('right');

          svgContainer.append('svg:g')
            .attr('class', 'y axis axisRight')
            .attr('transform', 'translate(' + (w + 15) + ',0)')
            .style('opacity', 0);

          svgContainer.select(".y.axis.axisRight").transition().duration(scope.time).ease("linear").style("opacity", 1)
            .attr("transform", "translate(" + (w + 15) + ",0 )").call(yAxisRight);
        }

          var svgLine = svgContainer.selectAll(".myLine").data(scope.data);

          svgLine.enter()
            .append("svg:path")
            .attr('id', function (d, i) {
              return chartDiv.id + i;
            })
            .attr('class', 'myLine')
            .style('fill', 'none')
            .style('opacity', scope.lineOpacity || 1)
            .style('stroke', function (d, i) {
              return _.has(d[i],'color')? d[i].color:color(i);
            })
            .attr('stroke-width', scope.lineWidth || 2)
            .attr("d", function (d, i) {
              return line(d);
            });

          svgLine.transition()
            .duration(scope.time)
            .style('stroke', function (d, i) {
              return _.has(d[i],'color')? d[i].color:color(i);
            })
            .style('opacity', scope.lineOpacity || 1)
            .style('stroke', function (d, i) {
              return _.has(d[i],'color')? d[i].color:color(i);
            })
            .attr('stroke-width', scope.lineWidth || 2)
            .attr('d', function (d) {
            return line(d);
          });


        if (scope.showPoints) {
//          transition().duration().ease("linear").
          svgContainer.selectAll('circle').transition().attr('r', 0).remove();
          for (var dataSet in scope.data) {
            var dots = svgContainer.selectAll('.myDots').data(scope.data[dataSet]);

            dots.enter()
              .append("svg:circle")
              .attr("class", function () {
                return dataSet + "myDots";
              })
              .style("fill", function () {
                return color(dataSet);
              })
              .style('stroke', 'grey')
              .style('opacity', scope.pointOpacity>0?scope.pointOpacity:0)
              .attr("cy", function (d) {
                console.log(d.y);
                console.log(yScale(d.y));
                return yScale(d.y);
              })
              .attr("cx", function (d) {
                console.log(d.x);
                console.log(xScale(d.x));
                return xScale(d.x);
              })
              .attr("r", 0)
              .style('cursor', 'crosshair')
              .on("mouseover", function (d, i) {
                d3.select(this).style('opacity', scope.pointOpacity>0?scope.pointOpacity:0);
                d3.select(this).attr('r', 10);
                scope.mouseOver(d, i);
                showTooltip(this, null, d, i);
              })
              .on("mousemove", function (d, i) {
                d3.select(this).style('opacity', scope.pointOpacity>0?scope.pointOpacity:0);
                d3.select(this).attr('r', 10);
                showTooltip(this, null, d, i);
              })
              .on("mouseout", function (d, i) {
                d3.select(this).style('opacity', scope.pointOpacity>0?scope.pointOpacity:0);
                d3.select(this).attr('r', 5);
                scope.mouseOut(d, i);
                hideTooltip(this, null, d, i);
              });
            dots.transition().duration(scope.time * 2)
              .style('opacity', scope.pointOpacity>0?scope.pointOpacity:0)
              .style('stroke', 'grey')
              .attr('cy', function (d) {
                return yScale(d.y);
              })
              .attr('cx', function (d) {
                return xScale(d.x);
              })
              .attr('r', scope.pointRadius || 5);
            dots.exit().transition().duration(scope.time).ease("linear").attr('r', 0).remove();
          }
        }
        svgLine.exit().transition().duration(scope.time).ease("linear").style('opacity', 0).remove();//
      }
      tm = null;
    }

    function updateScale() {
      fullH = parseFloat(scope.height) || chartDiv.parentElement.clientHeight || 500;
      fullW = parseFloat(scope.width) || chartDiv.parentElement.clientWidth || 500;
      m = {top: scope.marginTop || 40, right: scope.marginRight || 40, bottom: scope.marginBottom || 40, left: scope.marginLeft || 40}; // margins
      w = fullW - m.left - m.right;
      h = fullH - m.top - m.bottom;


      if (scope.data.length > 0) {
        /** MAX DATA VALUE: Returns maximum value in the specified data array  */
        var dMax = 0;
        var tempMax = 0;
        for (var i in scope.data) {
          tempMax = d3.max(scope.data[i], function (d) {
            return d.y;
          });
          if (tempMax > dMax) {
            dMax = tempMax;
          }
        }
        /** Check to see if x val is a datetime **/
        /** reset scale **/
        if (_.isDate(scope.data[0][0].x)) {
          xScale = d3.time.scale().range([0, w]);
        } else {
          xScale = d3.scale.linear().range([0, w]);
        }
        yScale = d3.scale.linear().range([h, 0]);

        /** Set max/min for x and y domains **/
        var xScaleExtents = [];
        _.each(scope.data,function(data){
          var extentsX = d3.extent(data,function(d){
            return d.x;
          });
          _.each(extentsX,function(ex){
            xScaleExtents.push(ex);
          });
        });

        xScale.domain(d3.extent(xScaleExtents, function (d) {
          return d;
        }));

        var yScaleExtents = [];
        _.each(scope.data,function(data){
          var extentsY = d3.extent(data,function(d){
            return d.y;
          });
          _.each(extentsY,function(ex){
            yScaleExtents.push(ex);
          });
        });

        yScale.domain(d3.extent(yScaleExtents, function (d) {
          return d;
        }));

      }

      $(el).css({
        width: scope.width,
        height: scope.height
      });
    }

    function updateDimensions() {
      updateScale();

      $(el).css({
        width: scope.width,
        height: scope.height
      });
      if (!tm) {
        tm = setTimeout(function () {
          animate();
        }, 2000);
      }
    }

    /***
     * create toolTip
     */
    function createToolTip() {
      if (scope.tt) {
        d3.select(el[0]).append("div:div")
          .attr('id', el[0].id + '_tooltip')
          .attr('class', 'tooltip left')
          .style({'position': 'absolute', 'left': 0, 'top': 0, 'display': 'none'});
        d3.select("#" + el[0].id + "_tooltip").append("div:div").attr('id', el[0].id + '_tooltip_txt').attr("class", "tooltip-inner").text("test THIS IS A TOOLTIP!#!@#!@#!!");
        d3.select("#" + el[0].id + "_tooltip").append("div:div").attr("class", "tooltip-arrow");
      }
    }

    /***
     * show toolTip
     *
     */
    function showTooltip(item, swap, d, i) {
      //        TODO: need to prevent from moving tooltip when i mouse over tool tip
      if (scope.tt) {
        var pos = d3.mouse(item);
        var top = pos[1];
        var left = pos[0];

        d3.select('#' + el[0].id + '_tooltip').style("display", "block");
        //add in ability to pass in if data is percent or not
        var numForm = d3.format(scope.dataFormat || "g2,");//"%");
        var xVal;
        if (_.isDate(item.__data__.x)) {
          xVal = moment(item.__data__.x).format(scope.dateFormat || "MMM YYYY");
        } else {
          xVal = item.__data__.x;
        }

        var text = item.__data__.label + ":" +
          " " + xVal + ", " + numForm(item.__data__.y) + "";
        //let offsetY and X be customized?
        var offsetY = 20;
        var offsetX = parseFloat(d3.select('#' + el[0].id + '_tooltip').style('width')) / 1.5;
        if (scope.ttPos == 'left') {
          if (left <= offsetX) {
            top += offsetY;
            left += offsetX - 50;
            d3.select('#' + el[0].id + '_tooltip').classed('left', '');
            d3.select('#' + el[0].id + '_tooltip').classed('right', 'true');
            d3.select('#' + el[0].id + '_tooltip').classed('top', '');
            d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
          } else {
            top += offsetY;
            left -= offsetX + 40;
            d3.select('#' + el[0].id + '_tooltip').classed('left', 'true');
            d3.select('#' + el[0].id + '_tooltip').classed('right', '');
            d3.select('#' + el[0].id + '_tooltip').classed('top', '');
            d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
          }
        } else if (scope.ttPos == 'right') {
          if (pos[0] >= w - offsetX) {
            top += offsetY;
            left -= offsetX + 35;
            d3.select('#' + el[0].id + '_tooltip').classed('left', 'true');
            d3.select('#' + el[0].id + '_tooltip').classed('right', '');
            d3.select('#' + el[0].id + '_tooltip').classed('top', '');
            d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
          } else {
            top += offsetY;
            left += offsetX - 40;
            d3.select('#' + el[0].id + '_tooltip').classed('left', '');
            d3.select('#' + el[0].id + '_tooltip').classed('right', 'true');
            d3.select('#' + el[0].id + '_tooltip').classed('top', '');
            d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
          }
        }
        else if (scope.ttPos == 'bottom') {
          left += -15;
          if (pos[1] >= h - offsetY * 2) {
            top += -10;

            d3.select('#' + el[0].id + '_tooltip').classed('left', '');
            d3.select('#' + el[0].id + '_tooltip').classed('right', '');
            d3.select('#' + el[0].id + '_tooltip').classed('top', 'true');
            d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
          } else {
            top += ((offsetY) + parseFloat(d3.select('#' + el[0].id + '_tooltip').style('height')));

            d3.select('#' + el[0].id + '_tooltip').classed('left', '');
            d3.select('#' + el[0].id + '_tooltip').classed('right', '');
            d3.select('#' + el[0].id + '_tooltip').classed('top', '');
            d3.select('#' + el[0].id + '_tooltip').classed('bottom', 'true');
          }
        }
        else if (scope.ttPos == 'top') {
          left += 0;
          if (pos[1] <= offsetY * 2) {
            top += ((offsetY) + parseFloat(d3.select('#' + el[0].id + '_tooltip').style('height')))-20;

            d3.select('#' + el[0].id + '_tooltip').classed('left', '');
            d3.select('#' + el[0].id + '_tooltip').classed('right', '');
            d3.select('#' + el[0].id + '_tooltip').classed('top', '');
            d3.select('#' + el[0].id + '_tooltip').classed('bottom', 'true');
          } else {
            top += -30;

            d3.select('#' + el[0].id + '_tooltip').classed('left', '');
            d3.select('#' + el[0].id + '_tooltip').classed('right', '');
            d3.select('#' + el[0].id + '_tooltip').classed('top', 'true');
            d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
          }
        }
        d3.select('#' + el[0].id + '_tooltip').style("left", left + 'px');
        d3.select('#' + el[0].id + '_tooltip').style("top", top + 'px');
        d3.select('#' + el[0].id + '_tooltip_txt').text(text);
      }
    }

    /***
     * hide toolTip
     */
    function hideTooltip(item) {
      if (scope.tt) {
        d3.select('#' + el[0].id + '_tooltip').style("display", "none");
      }
    }


    scope.$watch('width', updateDimensions);
    scope.$watch('data', animate, true);


  }

  return {
    restrict: 'EA',
    scope: {
      data: '=',
      // READ-ON-LOAD ATTRIBUTES
      color: '=',       // (2 in color precedence) a flat color
      colorRange: '=',  // (3) (default) color spread with one color
      colorHigh: '=',   // (1) color spread with two colors
      colorLow: '=',    // (1) the lower bound for the spread (defaults to black)
      mouseOver: '=',   // a mouseover click handler for each column
      mouseOut: '=',    // a mousout click handler for each column
      onClick: '=',
      chartId: '=',     // an id for the chart
      parentSvg: '=',    //if not null it will use parent svg
      time: '=',        // the animation time for the chart
      height: '=',      // the height of the SVG
      width: '=',        // the width of the SVG
      dataFormat: '=',
      showXAxis: '=',
      showYAxis: '=',
      showPoints: '=',
      pointOpacity: '=',
      pointRadius: '=',
      marginTop: '=',
      marginRight: '=',
      marginLeft: '=',
      marginBottom: '=',
      strokeColor: '=', //
      strokeWidth: '=',  //
      tt: '=',           // enable tooltip(true/false)
      ttPos: '=',         // tooltip position (left/right/top/bottom
      dateFormat: '=',
      lineOpacity: '=',
      lineWidth: '='
    },
    link: link
  };
}]);
