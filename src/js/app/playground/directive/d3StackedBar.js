/* global angular, d3 */
angular.module('playGroundApp').directive('d3StackedBar', [function () {
    function link(scope, el, colors, attrs, cntr) {

        /** CHART DIV: DOM Element which houses the line chart */
        var chartDiv = el[0];

        var fullH = parseFloat(scope.height) || el[0].parentElement.clientHeight || 500;
        var fullW = parseFloat(scope.width) || el[0].parentElement.clientWidth || 500;
        var time = scope.time || 500;

        var margin = {
                top: scope.marginTop || 0,
                right: scope.marginRight || 0,
                bottom: scope.marginBottom || 0,
                left: scope.marginLeft || 0
            };
        var height = fullH;// - (margin.top + margin.bottom);
        var width = fullW;// - (margin.left + margin.right);
        var stack2 = d3.layout.stack();
        var layer = {};
        var rect = {};
        var data = [];
        var yStackMax = 0;
        var yGroupMax = 0;
        var n = 2; // number of layers
        var m = 12; // number of samples per layer
        var color = d3.scale.linear().domain([0, n - 1]).range([scope.colorLow, scope.colorHigh]);
        var x = d3.scale.ordinal()
            .domain(d3.range(m))
            .rangeRoundBands([margin.left, width-margin.right], .4);

        var y = d3.scale.linear()
            .domain([0, yStackMax])
            .range([height-margin.bottom, margin.top]);

        var svg = d3.select(chartDiv).append("svg")
            .attr("id",chartDiv.id)
            .attr("width", '100%')
            .attr("height", '100%')
            .append("g");

        if(scope.showLine){
            /**
             * setup line
             */
            /**Line colors**/
            var lineColor = d3.scale.linear();

            if (scope.lineOptions.colorHigh) {
                var colorLow = scope.lineOptions.colorLow || 'black';
                lineColor.range([colorLow, scope.lineOptions.colorHigh]);
            } else if (scope.color) {
                lineColor = function () {
                    return scope.color;
                };
            } else {
               // var colorRange = colorUtil.getPaletteRange(scope.lineOptions.colorRange || '#FF8200');
                lineColor.setRange = function (count) {
                    lineColor.range(colorRange(count));
                };
            }
            /**
             * Scales
             */
            var xScaleLine = d3.time.scale().range([0,width-(margin.left+margin.right+50)]);
            /** Y SCALE: Places the .domain values from 0-dMax[n] within the .range of pixels from h-0
             * NOTE: .domain is set in animate() function */
            var yScaleLine = d3.scale.linear()
                .range([height-margin.bottom, margin.top]);

            /** DATA POINTS - Returns X & Y coordinate points for plotting the line
             * .x() returns the X coordinate and uses the xScale to place it between pixels 0-w (.range)
             * .y() returns the Y coordinate and uses the yScale[n] to place it between pixels h-0 (.range) */
            var line = d3.svg.line()
                .x(function (d) {
                    return xScaleLine(d.x);
                })
                .y(function (d) {
                    return yScaleLine(d.y);
                });
            /**
             * end line setup
             */
        }

        createToolTip();
        /**
         *Function resizeMyCharts
         * -- handles resizing charts
         * --
         */
        function resizeMyCharts() {
            updateChartDimensions();
            animate(scope.data);
            if(scope.showLine){
                updateLineScale();
                animateLine(scope.lineData);
            }
            drawAxis();
            clearTimeout(tm);
            tm = "";
        }

        /**
         *Function updateChartDimensions
         * -- gets the new dimensions from the chartContainer
         * -- adjusts the scale and axis according to the new dimensions
         */
        function updateChartDimensions() {
            width = scope.width; //- (margin.right + margin.left);
            height = scope.height;// - (margin.top + margin.bottom);
        }

        /**
         * for lines
         * updateScale
         */
        function updateLineScale(){
            //reset scales
            if(scope.lineData.length>0){
                /** MAX DATA VALUE: Returns maximum value in the specified data array  */
                var dMax = 0;
                var tempMax = 0;
                for (var i in scope.lineData) {
                    tempMax = d3.max(scope.lineData[i], function (d) {
                        return d.y;
                    });
                    if (tempMax > dMax) {
                        dMax = tempMax;
                    }
                }
                //check to see if x val is a datetime
                var testWidth = d3.selectAll('.layer');
                if(_.isDate(scope.lineData[0][0].x)){
                    xScaleLine = d3.time.scale().range([0,width-(margin.left+margin.right+55)]);
                }else{
                    xScaleLine = d3.scale.linear().range([0,width-(margin.left+margin.right+55)]);
                }

                //reset scale
                yScaleLine = d3.scale.linear().range([height-margin.bottom,margin.top]);

                //reset domain
                xScaleLine.domain(d3.extent(scope.lineData[0],function(d){return d.x;}));
                yScaleLine.domain([0,tempMax]);

                line = d3.svg.line()
                    .x(function (d) {
                        return xScaleLine(d.x);
                    })
                    .y(function (d) {
                        return yScaleLine(d.y);
                    });
            }
        }
        /**
         * animate
         * @param data
         */
        function animate(data) {
            if (data && data.length > 0) {
                n = data.length;
                m = data[0].length;

                var calcData = stack2(d3.range(n).map(function (i) {
                    return data[i];
                }));
                yGroupMax = d3.max(calcData, function (layer) {
                    return d3.max(layer, function (d) {
                        return d.y;
                    });
                });
                yStackMax = d3.max(calcData, function (layer) {
                    return d3.max(layer, function (d) {
                        return d.y0 + d.y;
                    });
                });
                x = d3.scale.ordinal().domain(data[0].map(
                    function (d) {
                        return d.xLabel;
                    }
                )).rangeRoundBands([margin.left, width-margin.right],.4);

                y = d3.scale.linear().domain([0, yStackMax]).range([height-margin.bottom, margin.top]);

                var delay = function (d, i) { return i * 33; };

                if(scope.chartType){}
                else{
                    scope.chartType = 'grouped';
                }
                if(scope.chartType=='stacked'){
                    y = d3.scale.linear().domain([0, yStackMax]).range([height-margin.bottom, margin.top]);
                    y.domain([0, yStackMax]);

                    for(var bar in calcData){
                        var rect = svg.selectAll(".rect"+bar)
                            .data(calcData[bar]);

                            rect.enter().append("rect")
                                .attr("class","rect"+bar)
                                .style("fill", function (d, i) {
                                    var _c = color(bar);
                                    return _c;
                                })
                                .attr("x", function(d) { return x(d.x); })
                                .attr("y", function(){return (height -(margin.bottom)); })
                                .attr("width", x.rangeBand())
                                .attr("height", 0);

                            rect.transition()
                                .delay(delay)
                                .duration(time)
                                .style('cursor','crosshair')
                                .attr("y", function(d) { return y(d.y0 + d.y); })
                                .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
                                .attr("x", function(d) { return x(d.x); })
                                .attr("width", x.rangeBand());

                            rect.on("mouseover",function(d){
                                d3.select(this).style("opacity",.5);
                                showTooltip(this);
                            });
                            rect.on("mouseout",function(d){
                                d3.select(this).style("opacity",1);
                                hideTooltip(this);
                            });
                            rect.on("mousemove",function(d){
                                showTooltip(this);
                            });
                    }

                }else if(scope.chartType=='grouped'){
                    y = d3.scale.linear().domain([0, yGroupMax]).range([height-margin.bottom, margin.top]);
                    y.domain([0, yGroupMax]);
                    for(var bar in calcData){
                        var rect = svg.selectAll(".rect"+bar)
                            .data(calcData[bar]);

                            rect.enter().append("rect")
                                .attr("class","rect"+bar)
                                .style("fill", function (d, i) {
                                    var _c = color(bar);
                                    return _c;
                                })
                                .attr("x", function (d) {return x(d.x);})
                                .attr("y", function () {return (height-(margin.bottom));})
                                .attr("width",function(){return x.rangeBand();})
                                .attr("height", 0);

                            rect.transition()
                                .delay(delay)
                                .duration(time)
                                .style('cursor', 'crosshair')
                                .attr("x", function (d, i, j) {return x(d.x) + x.rangeBand() / n*bar;})
                                .attr("width", x.rangeBand() / n)
                                .attr("y", function (d) {return y(d.y);})
                                .attr("height", function (d) {
                                    var _height = ((height-(margin.bottom)) - y(d.y));
                                    if(_height<0){_height=0;}
                                    return _height;
                                });

                            rect.on("mouseover", function (d) {
                                d3.select(this).style("opacity", .5);
                                showTooltip(this);
                            });
                            rect.on("mouseout", function (d) {
                                d3.select(this).style("opacity", 1);
                                hideTooltip(this);
                            });
                            rect.on("mousemove", function (d) {
                                showTooltip(this);
                            });
                    }


                }else if(scope.chartType=='overlap'){
                    y = d3.scale.linear().domain([0, yGroupMax]).range([height-margin.bottom, margin.top]);
                    y.domain([0, yGroupMax]);
                    for(var bar in calcData){
                        var rect = svg.selectAll(".rect"+bar)
                            .data(calcData[bar]);

                            rect.enter().append("rect")
                                .attr("class","rect"+bar)
                                .style("fill", function (d, i) {
                                    var _c = color(bar);
                                    return _c;
                                })
                                .attr("x", function (d) {return x(d.x);})
                                .attr("y", function () {return (height-(margin.bottom));})
                                .attr("width",function(){return x.rangeBand();})
                                .attr("height", 0);

                            rect.transition()
                                .delay(delay)
                                .duration(time)
                                .style('cursor', 'crosshair')
                                .style('opacity',.5)
                                .attr("x", function (d, i, j) {return x(d.x);})
                                .attr("width", x.rangeBand())
                                .attr("y", function (d) {return y(d.y);})
                                .attr("height", function (d) {
                                    var _height = ((height-(margin.bottom)) - y(d.y));
                                    if(_height<0){_height=0;}
                                    return _height;
                                });

                            rect.on("mouseover", function (d) {
                                d3.select(this).style("opacity", 1);
                                showTooltip(this);
                            });
                            rect.on("mouseout", function (d) {
                                d3.select(this).style("opacity",.5);
                                hideTooltip(this);
                            });
                            rect.on("mousemove", function (d) {
                                showTooltip(this);
                            });
                    }
                }

                if(scope.labelType=="onBar"){
                    // grab all the lebel elements
                    var label = svg.selectAll(".label")
                        .data(calcData[0]);
                    // create any new labels in their initial starting position
                    label.enter().append("text")
                        .attr('id', function(d, i){ return 'd3-' + (scope.chartId || 0) + '-label-' + i;  })
                        .attr("class", "label")
                        .attr("text-anchor", "end")
                        .attr("opacity", 0)
                        .attr("dy", ".3em")
                        .attr('x',function(d,i){
                            return x(d.x) + (x.rangeBand()/2);
                        })
                        .attr('y',function(d,i){
                            var h = height - y(d.y);
                            var offset = (h > 50) ? -5 : 5;
                            var top = y(d.y)+offset;
                            return top;
                        })
                        .attr('transform',function(d,i){
                            var left = x(d.x) + (x.rangeBand() / 2);
                            var top = y(0);
                            return "rotate(-90 "+left+","+top+")";
                        })
                        .style('cursor','crosshair')

                        .on('mouseover', function(d,i){
//                            scope.mouseOver(d,i);
//                            showTooltip(this,true,d,i);
                        })
                        .on('mouseout', function(d,i){
//                            scope.mouseOut(d,i);
//                            hideTooltip(this,true,d,i);
                        })
                        .on("mousemove",function(d){
                            //  showTooltip(this,true);
                        })
                        .on('click', function (d, i) { (scope.onClick || angular.noop)(d, i, d3.event); })
                        .text('0');

                    // transition all labels to their next position
                    label.transition()
                        .delay(delay)
                        .duration(time)
                        .attr("text-anchor", function (d) {
                            var h = height - y(d.y);
                            return (h > 50) ? "end" : "start";
                        })
                        .attr('x',function(d,i){
                            var h = height - y(d.y);
                            var offset = (h > 50) ? -5 : 5;
                            return x(d.x) + (x.rangeBand()/2)+offset;
                        })
                        .attr('y',function(d,i){
                            var h = height - y(d.y);
                            var offset = (h > 50) ? 5 : -5;
                            var top = y(d.y);
                            return top;
                        })
                        .attr('transform',function(d,i){
                            var left = x(d.x) + (x.rangeBand() / 2);
                            var top = y(d.y);

                            return "rotate(-90 "+left+","+top+")";
                        })
                        .attr("opacity", 1)
                        .tween("text", function (d) {
                            var i = d3.interpolate(this.textContent, d.y);
                            return function (t) {
                                this.textContent = Math.round(i(t));
                            };
                        });

                    // discard all labels that no longer belong
                    label.exit()
                        .transition()
                        .delay(delay)
                        .duration(time / 2)
                        .attr('opacity', 0)
                        .remove();
                }
                drawAxis();
            }
        }
        function animateLine(lineData){
            updateLineScale();
            if(lineData && lineData.length>0){
                for(var item in scope.lineData[0]){
                    if(scope.lineData[0][item].y<0){scope.lineData[0][item].y=0;}
                }
                var svgLine = svg.selectAll(".myLine")
                    .attr('transform', 'translate(' + (margin.left+27) + ',' + -(margin.top-12) + ')')
                    .data(scope.lineData);

                svgLine.enter()
                    .append("svg:path")
                    .attr('id', function (d, i) {
                        return chartDiv.id + '-line-' + i;
                    })
                    .attr('class', 'myLine')
                    .style('fill', 'none')
                    .style('opacity', 1)
                    .style('stroke', function (d, i) {
                        return lineColor(i);
                    })
                    .style('z-index',99999)
                    .attr('stroke-width', 3)
                    .attr("d", function (d, i) {
                        return line(d);
                    });

                svgLine.transition().duration(scope.lineOptions.time).attr('d', function (d) {
                    return line(d);
                });
                if(scope.lineOptions.showPoints){
                    svg.selectAll('circle').transition().duration().ease("linear").attr('r',0).remove();
                    for(var dataSet in scope.lineData){

                        var dots = svg.selectAll('myDots'+dataSet).data(scope.lineData[dataSet]);

                        dots.enter()
                            .append("svg:circle").attr('transform', 'translate(' + (margin.left+27) + ',' + -(margin.top-12) + ')')
                            .attr("class",function(){return "myDots"+dataSet;})
                            .style("fill",function(){return lineColor(dataSet);})
                            .style('opacity',0)
                            .attr("cy",function(d){
                                return yScaleLine(d.y);
                            })
                            .attr("cx",function(d){
                                return xScaleLine(d.x);
                            })
                            .attr("r",0)
                            .style('cursor', 'crosshair')
                            .on("mouseover", function (d, i) {
                                d3.select(this).style("opacity", 0);
                                d3.select(this).attr('r',10);
                                scope.mouseOver(d, i);
                                showTooltip(this,null,d,i);
                            })
                            .on("mousemove", function (d, i) {
                                d3.select(this).style("opacity", 0);
                                d3.select(this).attr('r',10);
                                //scope.mouseOver(d, i);
                                showTooltip(this,null,d,i);
                            })
                            .on("mouseout", function (d, i) {
                                d3.select(this).style("opacity", 0);
                                d3.select(this).attr('r',2);
                                scope.mouseOut(d, i);
                                hideTooltip(this,null,d,i);
                            });
                        dots.transition().duration(scope.lineOptions.time*2)
                            .style('opacity',0)
                            .attr('cy', function (d) {
                                return yScaleLine(d.y);
                            })
                            .attr('cx',function(d){
                                return xScaleLine(d.x);
                            })
                            .attr('r',2);
                        dots.exit().transition().duration(scope.lineOptions.time).ease("linear").attr('r',0).remove();
                    }
                }

                svgLine.exit().transition().duration(scope.lineOptions.time).ease("linear").style('opacity',0).remove();//
            }
        }
        var tm = ""
        /**
         *Function drawAxis
         * -- creates/updates charts x and y axis
         */
        function drawAxis() {
            if (scope.showXAxis && !xAxis) {
                var xAxis = d3.svg.axis()
                    .scale(x)
                    .tickSize(5)
                    .ticks(0)
                    .tickPadding(0)
                    .orient("bottom");
            }
            if (scope.showYAxis && !yAxis) {
                var yAxis = d3.svg.axis()
                    .scale(y)
                    .tickSize(5)
                    .ticks(5)
                    .tickPadding(0)
                    .orient("left");
            }
            var xAxisNum = svg.selectAll(".x.axis");
            var yAxisNum = svg.selectAll(".y.axis");
            svg.selectAll(".x.axis").transition().duration(time).ease("linear").style("opacity", 1).remove();
            if (scope.showXAxis&&xAxisNum<1) {
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (height) + ")");
            }else  if(scope.showXAxis){
                svg.select(".x.axis").transition().duration(time).ease("linear").style("opacity", 1)
                    .attr("transform", "translate(0," + (height - margin.bottom) + ")").call(xAxis);

                svg.selectAll(".x.axis text").style("opacity", 1)
                    .attr("transform", function () {
                        return "translate(" + (this.getBBox().height * -.5) + "," + (this.getBBox().height + 2) + ")rotate(-45)";
                    });
            }

            svg.selectAll(".y.axis").transition().delay(time).ease("linear").attr('opacity', 1).remove();
            if (scope.showYAxis&&yAxisNum<1) {
                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate("+margin.left+",0)");
            }else if(scope.showYAxis){
                svg.select(".y.axis").transition().duration(time).ease("linear").style("opacity", 1)
                    .attr("transform", "translate("+margin.left+",0)").call(yAxis);

                svg.selectAll(".y.axis text").style("opacity", 1)
                    .attr("transform", function () {
                        return "translate(" + (this.getBBox().height * -.5) + "," + (0) + ")rotate(-45)";
                    });
            }
        }

        /**
         *Function bumpLayer
         * -creates random data
         * // Inspired by Lee Byron's test data generator.
         */

        function bumpLayer(n, o) {

            function bump(a) {
                var x = 1 / (.1 + Math.random()),
                    y = 2 * Math.random() - .5,
                    z = 10 / (.1 + Math.random());
                for (var i = 0; i < n; i++) {
                    var w = (i / n - y) * z;
                    a[i] += x * Math.exp(-w * w);
                }
            }

            var a = [], i;
            for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
            for (i = 0; i < 5; ++i) bump(a);
            return a.map(function (d, i) {
                return {x: i, y: Math.max(0, d)};
            });
        }
        scope.$watch('data', animate);
        if(scope.showLine){
            scope.$watch('lineData',animateLine);
        }



        //width watch call resizeMyCharts to adjust the scales of the charts
        scope.$watch('width', function () {
            width = parseFloat(scope.width) || el[0].parentElement.clientWidth;
            height = parseFloat(scope.height) || el[0].parentElement.clientHeight;

            if (tm == "") {
                tm = setTimeout(resizeMyCharts, 1000);
            }
        });
        //height watch call resizeMyCharts to adjust the scales of the charts
        scope.$watch('height', function () {
            width = parseFloat(scope.width) || el[0].parentElement.clientWidth;
            height = parseFloat(scope.height) || el[0].parentElement.clientHeight;

            if (tm == "") {
                tm = setTimeout(resizeMyCharts,1000);
            }

        });

        /***
         * create toolTip
         */
        function createToolTip() {
            d3.select(el[0]).append("div:div")
                .attr('id', el[0].id + '_tooltip')
                .attr('class', 'tooltip left')
                .style({'position': 'absolute', 'left': 0, 'top': 0, 'display': 'none'});
            d3.select("#" + el[0].id + "_tooltip").append("div:div").attr('id', el[0].id + '_tooltip_txt').attr("class", "tooltip-inner").text("");
            d3.select("#" + el[0].id + "_tooltip").append("div:div").attr("class", "tooltip-arrow");
        }

        /***
         * show toolTip
         *
         */
        function showTooltip(item) {
            //        TODO: need to prevent from moving tooltip when i mouse over tool tip
            if(scope.tt){
                var pos = d3.mouse(item);
                d3.select('#' + el[0].id + '_tooltip').style("display", "block");
                var offsetY = parseFloat(d3.select('#' + el[0].id + '_tooltip').style('height'));
                var offsetX = parseFloat(d3.select('#' + el[0].id + '_tooltip').style('width'));
                var top = pos[1]-25;
                var left = pos[0]-75;
                //formatting
                //[​[fill]align][sign][symbol][0][width][,][.precision][type]

                var format = d3.format('#0,');
                var formatted = format(item.__data__.y.toFixed(0));
                var unit = item.__data__.unit?item.__data__.unit:''
                var tip = "";

                if (scope.ttPos == 'left') {
                    top = pos[1] - 10;
                    if (pos[0] <= offsetX) {
                        left = (pos[0] + offsetX) - 120;
                        d3.select('#' + el[0].id + '_tooltip').classed('left', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('right', 'true');
                        d3.select('#' + el[0].id + '_tooltip').classed('top', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
                    } else {
                        left = (pos[0] - offsetX) - 20;
                        d3.select('#' + el[0].id + '_tooltip').classed('left', 'true');
                        d3.select('#' + el[0].id + '_tooltip').classed('right', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('top', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
                    }
                } else if (scope.ttPos == 'right') {
                    top = pos[1] - 10;
                    if (pos[0] >= width - offsetX) {
                        left = (pos[0] - offsetX) - 20;
                        d3.select('#' + el[0].id + '_tooltip').classed('left', 'true');
                        d3.select('#' + el[0].id + '_tooltip').classed('right', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('top', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
                    } else {
                        left = (pos[0] + offsetX) - 120;
                        d3.select('#' + el[0].id + '_tooltip').classed('left', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('right', 'true');
                        d3.select('#' + el[0].id + '_tooltip').classed('top', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
                    }
                }
                else if (scope.ttPos == 'bottom') {
                    left = pos[0] - 70;
                    if (pos[1] >= height - offsetY * 2) {
                        top = (pos[1] - offsetY) - 15;
                        d3.select('#' + el[0].id + '_tooltip').classed('left', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('right', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('top', 'true');
                        d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
                    } else {
                        top = (pos[1] + offsetY) - 10;
                        d3.select('#' + el[0].id + '_tooltip').classed('left', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('right', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('top', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('bottom', 'true');
                    }
                }
                else if (scope.ttPos == 'top') {
                    left = pos[0]-70;
                    if (pos[1] <= offsetY * 2) {
                        top = (pos[1] + offsetY) - 15;
                        d3.select('#' + el[0].id + '_tooltip').classed('left', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('right', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('top', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('bottom', 'true');
                    } else {
                        top = (pos[1] - offsetY) - 10;
                        d3.select('#' + el[0].id + '_tooltip').classed('left', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('right', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('top', 'true');
                        d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
                    }
                } else {
                    //default to left
                    top = pos[1] - 10;
                    if (pos[0] <= offsetX) {
                        left = (pos[0] + offsetX) - 120;
                        d3.select('#' + el[0].id + '_tooltip').classed('left', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('right', 'true');
                        d3.select('#' + el[0].id + '_tooltip').classed('top', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
                    } else {
                        left = (pos[0] - offsetX) - 20;
                        d3.select('#' + el[0].id + '_tooltip').classed('left', 'true');
                        d3.select('#' + el[0].id + '_tooltip').classed('right', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('top', '');
                        d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
                    }
                }

                if(scope.ttPosOverride){
                    d3.select('#' + el[0].id + '_tooltip').classed('top', 'true');
                    d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
                    d3.select('#' + el[0].id + '_tooltip').classed('left', '');
                    d3.select('#' + el[0].id + '_tooltip').classed('right', '');
                    if(item.localName=="rect"){
                        top = pos[1]-scope.ttPosOverride.top;//35;
                        left = pos[0]-scope.ttPosOverride.left;//70;
                        tip = item.__data__.tooltip + ": " + formatted + ' '+unit;
                    }else{
                        top = pos[1]-35;
                        left = pos[0]+50;
                        tip = item.__data__.label + ": " + formatted + ' '+unit;
                    }
                }else{
                    tip = item.__data__.tooltip + ": " + formatted + ' '+unit;
                }
                d3.select('#' + el[0].id + '_tooltip').style("left", left + 'px');
                d3.select('#' + el[0].id + '_tooltip').style("top", top + 'px');
                d3.select('#' + el[0].id + '_tooltip_txt').text(tip);
            }
        }

        /***
         * hide toolTip
         */
        function hideTooltip(item) {
            d3.select('#' + el[0].id + '_tooltip').style("display", "none");
        }
    }

    return {
        scope: {
            // WATCHED ATTRIBUTES
            data: '=chartData',    // data for the barchart
            lineData: '=lineData', // data for the overlay line
            // READ-ON-LOAD ATTRIBUTES
            lineOptions:'=',     // line options
            chartType: '=',   // set to grouped,stacked,overlay
            showLine: '=',    // show a line overlaid on the bars
            showXAxis: '=',   // show/hide charts X Axis
            showYAxis: '=',   // show/hide charts Y axis
            labelType:'=',    // type of label.. onBar - this will put the y value of the data being displayed on the bar/bars
            color: '=',       // (2 in color precedence) a flat color
            colorRange: '=',  // (3) (default) color spread with one color
            colorHigh: '=',   // (1) color spread with two colors
            colorLow: '=',    // (1) the lower bound for the spread (defaults to black)
            mouseOver: '=',   // a mouseover click handler for each column
            mouseOut: '=',    // a mousout click handler for each column
            onClick: '=',
            chartId: '=id',   // an id for the chart
            time: '=',        // the animation time for the chart
            height: '=',      // the height of the SVG
            width: '=',       // the width of the SVG
            marginTop: '=',
            marginRight: '=',
            marginLeft: '=',
            marginBottom: '=',
            tt: '=',          // enable tooltip (true/false)
            ttPos: '=',
            ttPosOverride: '=', //override tooltip positions
            ngxOnshow: '&'
        },
        restrict: 'A',
        priority: '0',
        link: link
    };
}]);
