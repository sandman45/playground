/**
 * Created by matthew.sanders on 2/14/14.
 */
angular.module('playGroundApp').directive('d3BubbleTesting', [function () {
    function link(scope, el, attrs) {
        /**
         * chartDiv
         *  CHART DIV: DOM Element which houses the line chart
         * @type {*}
         */
        var chartDiv = el[0];
        /**
         * fullH
         * HEIGHT : Detects height of the CHART DIV
         * @type {Number|number|*}
         */
        var fullH = parseFloat(scope.height) || chartDiv.parentElement.clientHeight || 500;
        /**
         * fullW
         * WIDTH : Detects width of the CHART DIV
         * @type {Number|number|*}
         */
        var fullW = parseFloat(scope.width) || chartDiv.parentElement.clientWidth || 500;
        /**
         * tm
         * timeout function
         * @type {null}
         */
        var tm = null;
        /**
         * m
         * margins of the chart
         * @type {{top: (string|marginTop|marginTop|marginTop|marginTop|marginTop|*), right: (string|marginRight|marginRight|marginRight|marginRight|marginRight|*), bottom: (string|marginBottom|marginBottom|marginBottom|marginBottom|number), left: (string|marginLeft|marginLeft|marginLeft|marginLeft|marginLeft|*)}}
         */
        var m = {
            top:scope.marginTop||20,
            right:scope.marginRight||20,
            bottom:scope.marginBottom||20,
            left:scope.marginLeft||20
        };
        /**
         * CHART DIMENSIONS: Define dimensions of chart
         * @type {number}
         */
        var w = fullW - m.left - m.right;
        /**
         * h
         * CHART DIMENSIONS: Define dimensions of chart
         * @type {number}
         */
        var h = fullH - m.top - m.bottom

        /**bubble chart vals**/
        var totalValue = 0;
        var centerX_Divider = 2;
        var centerY_Divider = 2;
        var centerX = fullW/centerX_Divider;
        var centerY = fullH/centerY_Divider;

        /**
         * xScale
         * scale used for the Scatter Layout
         * @type {range|*|range|range|range|range}
         */
        var xScale;
        /**
         * yScale
         * scale used for the Scatter Layout
         * @type {range|*|range|range|range|range}
         */
        var yScale;
        /**
         * xAxis
         * axis for the Scatter
         * @type {*}
         */
        var xAxis;
        /**
         * yAxis
         * axis for the scatter
         * @type {*}
         */
        var yAxis;
        /**
         * changeScale
         * @type {*}
         */
        var changeScale = d3.scale.linear().domain([ 600, 850 ]).range([ 600, 850 ]).clamp(true);
        /**
         * rScale
         * scale used for the radius of the bubble
         * @type {range|*|range|range|range|range}
         */
        var rScale = d3.scale.pow().exponent(0.5).domain([0,1]).range([1,10]);
        /**
         * strokeColor
         * stroke color scale
         * @type {range|*|range|range|range|range}
         */
        var strokeColor = d3.scale.ordinal().domain(scope.colorStroke.domain).range(scope.colorStroke.range);
        /**
         * fillColor
         * fill color scale
         * @type {range|*|range|range|range|range}
         */
        var fillColor = d3.scale.ordinal().domain(scope.colorFill.domain).range(scope.colorFill.range);
        /**
         * randomColors
         * gets random colors if no color is specified
         * @type {*}
         */
        var randomColors = d3.scale.category20b();
        var drag = d3.behavior.drag();
        var defaultGravity = 0.1;
        var nodes=[];
        var outX = 200;
        var outY = 200;
        var boundingRadius = radiusScale((totalValue/2));
        var parentView=true
        var data=[];
        var circle;
        var sentimentActive = false;

        /***Create Tooltip **/
        createToolTip();

        changeScale(0);
        /** SVG CONTAINER: Creates an SVG element with the desired dimensions and margins and places it in the CHART DIV */
        var svgContainer = d3.select(chartDiv).append('svg')
            .attr('class', 'svg-container')
            .attr('width', '100%')
            .attr('height', h + m.top + m.bottom);

        /**
         * Formats data for use in the bubble chart
         * @name bubble#chartData
         * @function
         */
        function chartData(){
            if (scope.randomData) {
                var rng = function (p) {
                    if (!p) {
                        p = Math.floor((Math.random() * 3) + 1);
                    }
                    return Math.floor((Math.random() * 850) + 1);
                };
                var rngTime = function(x){
                    var time = moment().subtract('days',x);
                    return time;
                }
                data = [];
                for (var j = 0; j < 25; j++) {
                    data.push({id: j, metrics: {metric1: rng(1), metric2: rng(2), metric3: rng(3),metric4:rngTime(j)}, key: "bubble-" + j, fields: {sentiment: "POSITIVE"}});
                }
            }else{
                data = scope.data;
            }
            nodes = [];
            for (var i = 0; i < data.length; i++) {
                var n = data[i];
                var out = {
                    sid: n.id,
                    radius: radiusScale(n.metrics[scope.radiusScaleMetric]),
                    change: n.metrics['metric2'],
                    changeCategory: n.metrics[scope.changeCatMetric],
                    value: n.metrics[scope.valueMetric],
                    name: n.key,
                    fields: n.fields,
                    metrics: n.metrics,
                    x: parseFloat($('#bubble-circle' + n.id).attr('cx')) ? parseFloat($('#bubble-circle' + n.id).attr('cx')) : Math.floor(Math.random() * w),//Math.floor(Math.random() * (centerX - outX)) + (centerX),
                    y: parseFloat($('#bubble-circle' + n.id).attr('cy')) ? parseFloat($('#bubble-circle' + n.id).attr('cy')) : Math.floor(Math.random() * (centerY - outY)) + (centerY)
                };
                nodes.push(out);
            }
            nodes.sort(function (a, b) {
                return Math.abs(b.value) - Math.abs(a.value);
            });
        }
        /**
         * animate
         */
        function animate(){
            updateScale();
            chartData();
            circle = svgContainer.selectAll(".cir").data(nodes,function(d){return 'bubble-circle' + d.sid;});
            circle.enter()
                .insert("svg:circle")
                .attr('class',function(d,i){return 'cir';})
                .attr("r", function(d) {
                    return d.radius;
                })
                .attr('cx',function(d){
                    return d.x;
                })
                .attr('cy',function(d){
                    return d.y;
                })
                .style("fill", function(d) {
                    if(sentimentActive){
                        if(d.fields.sentiment=="POSITIVE"||d.name=="POSITIVE"){
                            return 'green';
                        }else if(d.fields.sentiment=="NEGATIVE"||d.name=="NEGATIVE"){
                            return 'red';
                        }else if(d.fields.sentiment=="MIXED"||d.name=="MIXED"){
                            return 'blue';
                        }else if(d.fields.sentiment=="NEUTRAL"||d.name=="NEUTRAL"){
                            return 'yellow';
                        }
                    }else{
                        return getFillColor(d);
                    }
                })
                .style("stroke-width", 1).attr('id', function(d) {
                    return 'bubble-circle' + d.sid;
                })
                .style("stroke", function(d) {
                    return getStrokeColor(d);
                })
                .style("cursor","crosshair")
                .on("mouseover", function(d,i) {
                    d3.select(this).style("stroke-width", 3);
                    showTooltip(this,null,d,i);
                })
                .on("mouseout", function() {
                    d3.select(this).style("stroke-width", 1);
                    hideTooltip(this);
                })
                .on("mousemove",function(d,i){
                    showTooltip(this,null,d,i)
                })
                .on("click",function(d){
                    scope.click(d);
                });
            //                .call(_self.drag);

            circle.transition().duration(2500).attr("r", function(d) {
                return d.radius;
            });
            circle.exit().transition().duration(1000).attr('cx',-500).remove();
            startForce();
            setLayout();
            tm=null;
            createLegend();
        }

        /**
         * radiusScale
         * Sets radius value for bubble after it is scaled.
         * @param n
         * @returns {*}
         */
        function radiusScale(n){
            return rScale(Math.abs(n));
        }
        /**
         * getStrokeColor
         * Gets stroke color from function and returns color
         * @param d
         * @returns {range|*|range|range|range|range}
         */
        function getStrokeColor(d){
            if(scope.colorMetric.stroke){
                return strokeColor(d.metrics[scope.colorMetric.stroke]);
            }else{
                return "black";
            }

        }
        /**
         * getFillColor
         * Gets stroke color from function and returns color
         * @param d
         * @returns {*}
         */
        function getFillColor(d){
            if(scope.colorMetric.fill){
                return fillColor(d.metrics[scope.colorMetric.fill]);
            }
            else{
                return randomColors(d.metrics[scope.valueMetric]);
            }
        }
        /**
         * defaultCharge
         * Returns a charge value based on the bubble object value
         * @param d
         * @returns {number}
         */
        function defaultCharge(d) {
            if (d.value < 0) {
                return 0;
            } else {
                var k = Math.sqrt(nodes.length/(w*h));
                return -Math.pow(d.radius, 2.0) / 8;
                //return (-10/k);
            }
        }
        /**
         * defaultGravity
         * @param d
         * @returns {number}
         */
        function defaultGravity(d) {
            if (d.value < 0) {
                return 0;
            } else {
                var k = Math.sqrt(nodes.length/(w*h));
                return -0.01;
                //return (100*k);
            }
        }

        /**
         * buoyancy
         * Sets the buoyancy for the bubble
         * @param alpha
         * @returns {Function}
         */
        function buoyancy(alpha) {
            return function(d) {
                var targetY = centerY - (((Math.random()*3)-3) / 3) * boundingRadius;
                d.y = d.y + (targetY - d.y) * (defaultGravity) * alpha * alpha * alpha * 100;
            };
        }

        /**
         * startForce
         * Sets the forces for the widget based on nodes (data) and the widgets dimensions
         */
        function startForce() {
            force = d3.layout.force().nodes(nodes).size([fullW, fullH]);
        }

        /**
         * explodeLayout
         * Applies a new set of forces for the current bubbles drawn in the svg
         */
        function explodeLayout(){
            if(parentView){
                force.gravity(-0.01).charge(defaultCharge).friction(0.9).on("tick", function(e) {
                    exp.each(explodeSort(e.alpha)).attr("cx", function(d) {
                        return d.x;
                    }).attr("cy", function(d) {
                            return d.y;
                        });
                }).start();
            }
        }

        /**
         * explodeSort
         * Sets positions for bubbles to be repelled from center of widget
         * @param _self
         * @param alpha
         * @returns {Function}
         */
        function explodeSort(alpha){
            return function(d) {
                var targetY = centerY;
                var targetX = w / 2;
                d.y = d.y + (targetY - d.y) * (defaultGravity + 0.02) * alpha*1.1;
                d.x = d.x + (targetX - d.x) * (defaultGravity + 0.02) * alpha*1.1;
            };
        }

        /**
         * totalLayout
         * Applies a new set of forces for the current bubbles drawn in the svg
         */
        function totalLayout(){
            updateScale();
            if(parentView){
                force.gravity(-0.01).charge(defaultCharge).friction(0.9).on("tick", function(e) {
                    circle.each(totalSort(e.alpha)).each(buoyancy(e.alpha)).attr("cx", function(d) {
                        return d.x;
                    }).attr("cy", function(d) {
                            return d.y;
                        });
                }).start();
            }
        }

        /**
         * totalSort
         * Sets positions for all the bubbles to be gathered in center of widget
         * @param alpha
         * @returns {Function}
         */
        function totalSort(alpha) {
            return function(d) {
                var targetY = centerY;
                var targetX = w / 2;
                d.y = d.y + (targetY - d.y) * (defaultGravity + 0.02) * alpha*1.1;
                d.x = d.x + (targetX - d.x) * (defaultGravity + 0.02) * alpha*1.1;
            };
        }

        /**
         * typeLayout
         * Applies a new set of forces for the current bubbles drawn in the svg
         */
        function typeLayout() {
            updateScale();
            if(parentView){
                force.gravity(-0.001).friction(0.9).charge(defaultCharge).on("tick", function(e) {
                    circle.each(typeSort(e.alpha)).each(buoyancy(e.alpha)).attr("cx", function(d) {
                        return d.x;
                    }).attr("cy", function(d) {
                            return d.y;
                        });
                }).start();
            }
        }

        /**
         * typeSort
         * Sets positions for all the bubbles
         * this one we separate bubbles by count of metric 2
         * @param _self
         * @param alpha
         * @returns {Function}
         */
        function typeSort(alpha) {
            return function(d) {
                var targetY = centerY;
                var targetX = 0;
                if (d.metrics[scope.layoutMetrics[0]] >=700) {
                    targetX = w>400?w-200:w-200;
                }
                else {
                    targetX = (w/4);
                }
                d.y = d.y + (targetY - d.y) * (defaultGravity) * alpha * 1.1;
                d.x = d.x + (targetX - d.x) * (defaultGravity) * alpha * 1.1;
            };
        }

        /**
         * metricLayout
         * Applies a new set of forces for the current bubbles drawn in the svg
         */
        function metricLayout() {
            force.stop();
            updateScale();
            if(parentView){
                force.gravity(-0.001).friction(0.9).charge(defaultCharge).on("tick", function(e) {
                    circle.each(metricSort(e.alpha)).each(buoyancy(e.alpha)).attr("cx", function(d) {
                        return d.x;
                    }).attr("cy", function(d) {
                            return d.y;
                        });
                }).start();
            }
        }

        /**
         * metricSort
         * Sets positions for all the bubbles
         * this one we separate bubbles by count of metric 3
         * @param _self
         * @param alpha
         * @returns {Function}
         */
        function metricSort(alpha) {
            return function(d) {
                var targetY = centerY;
                var targetX = centerX;
                if (d.metrics[scope.layoutMetrics[1]] > d3.max(data,function(d){
                    return d.metrics[scope.layoutMetrics[1]];
                })/2) {
                    targetY = h/4;
                }
                else {
                    targetY = h-150;
                }
                d.y = d.y + (targetY - d.y) * (defaultGravity) * alpha * 1.1;
                d.x = d.x + (targetX - d.x) * (defaultGravity) * alpha * 1.1;
            };
        }

        /**
         * sentimentLayout
         * applies a new set of forces for the current bubbles drawn in the svg
         */
        function sentimentLayout() {
            if(parentView){
                force.gravity(-0.001).friction(0.9).charge(defaultCharge).on("tick",function(e) {
                    circle.each(sentimentSort(e.alpha)).each(buoyancy(e.alpha)).attr("cx",function(d) {
                        return d.x;
                    }).attr("cy",function(d) {
                            return d.y;
                        });
                }).start();
            }
        }

        /**
         * sentimentSort
         *
         * Sets positions for all the bubbles
         * these are separated by sentiment.
         * @param alpha
         * @returns {Function}
         */
        function sentimentSort(alpha) {
            return function(d) {
                var targetY = centerY;
                var targetX = centerX;
                if (d.fields.sentiment=="POSITIVE"||d.name=="POSITIVE") {
                    targetY = 150;
                    targetX = (w/4);//200;
                }else if(d.fields.sentiment=="NEGATIVE"||d.name=="NEGATIVE"){
                    targetY = 150;
                    targetX = (w-200);//450;
                }else if(d.fields.sentiment=="MIXED"||d.name=="MIXED"){
                    targetY = 400;
                    targetX = (w/4);//200;
                }else if(d.fields.sentiment=="NEUTRAL"||d.name=="NEUTRAL"){
                    targetY = 430;
                    targetX = (w-200);//450;
                }
                d.y = d.y + (targetY - d.y) * (defaultGravity) * alpha * 1.1;
                d.x = d.x + (targetX - d.x) * (defaultGravity) * alpha * 1.1;
            };
        }
        function departmentLayout() {
            var that = this;
            this.force.gravity(0).charge(1).friction(0).on("tick", function(e) {
                that.circle
                    // .each(that.departmentSort(e.alpha))
                    // .each(that.collide(0.5))
                    .each(staticDepartment(e.alpha)).attr("cx", function(d) {
                        return d.x;
                    }).attr("cy", function(d) {
                        return d.y;
                    });
            }).start();
        }
        function staticDepartment(alpha) {
            var that = this;
            return function(d) {
                var targetY = 0;
                var targetX = 0;
                if (d.positions.department) {
                    targetX = d.positions.department.x;
                    targetY = d.positions.department.y;
                };
                d.y += (targetY - d.y) * Math.sin(Math.PI * (1 - alpha * 10)) * 0.6
                d.x += (targetX - d.x) * Math.sin(Math.PI * (1 - alpha * 10)) * 0.4
            };
        }

        function relevantLayout() {
            var that = this;
            this.force.gravity(0).friction(0.9).charge(that.defaultCharge).on("tick", function(e) {
                that.circle.each(relevantSort(e.alpha)).each(that.buoyancy(e.alpha)).attr("cx", function(d) {
                    return d.x;
                }).attr("cy", function(d) {
                        return d.y;
                    });
            }).start();
        }
        function relevantSort(alpha) {
            var that = this;
            return function(d) {
                var targetY = that.centerY;
                var targetX = 0;
                if (d.isNegative) {
                    if (d.changeCategory > 0) {
                        d.x = -200
                    } else {
                        d.x = 1100
                    }
                    return;
                }
                if (d.discretion === that.DISCRETIONARY) {
                    targetX = 550
                } else if ((d.discretion === that.relevant) || (d.discretion === that.NET_INTEREST)) {
                    targetX = 400
                } else {
                    targetX = 900
                };
                d.y = d.y + (targetY - d.y) * (that.defaultGravity) * alpha * 1.1
                d.x = d.x + (targetX - d.x) * (that.defaultGravity) * alpha * 1.1
            };
        }
        function scatterLayout() {
            force.stop();
            var xDom = d3.extent(data, function (d) {
                return d.metrics[scope.layoutMetrics[3][3]];
            });

            xScale = d3.time.scale().domain(xDom).range([m.left, w]);

            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .tickFormat(d3.time.format("%d - %b - %Y")).ticks(4);

            svgContainer.append('g')
                .attr('transform', 'translate(0,' + (h+m.top) + ')')
                .attr('class', 'axis')
                .call(xAxis);

            var yDom = d3.extent(data,function(d){
                return d.metrics[scope.layoutMetrics[3][0]];
            });

            yScale = d3.scale.linear().domain(yDom).range([h, m.bottom]);

            var rDom = d3.extent(data,function(d){
                return d.metrics[scope.layoutMetrics[3][1]];
            });

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left').ticks(10);

            svgContainer.append('g')
                .attr('transform', 'translate('+ (m.left-5)+',0)')
                .attr('class', 'axis')
                .call(yAxis);

            rScale = d3.scale.pow().exponent(0.5).domain(rDom).range([2.5,8]);

            force.gravity(0).charge(0).friction(0.2).on("tick", function(e) {
                circle.each(scatterSort(e.alpha)).attr("cx", function(d) {
                    return d.x;
                }).attr("cy", function(d) {
                        return d.y;
                    }).attr("r",function(d){return d.radius;});
            }).start();
        }
        function scatterSort(alpha) {
            return function(d) {

                var targetY = 0;
                var targetX = 0;
                //scope.layoutMetrics[3][x]
                //x = 0 = y position
                //x = 1 = radius
                //x = 2 = color
                //x = 3 = interval

                targetY = yScale(d.metrics[scope.layoutMetrics[3][0]]);
                targetX = xScale(d.metrics[scope.layoutMetrics[3][3]]);

                d.radius = 5;//rScale(d.metrics[scope.layoutMetrics[3][2]]);

                d.y = d.y + (targetY - d.y) * Math.sin(Math.PI * (1 - alpha * 10)) * 0.2
                d.x = d.x + (targetX - d.x) * Math.sin(Math.PI * (1 - alpha * 10)) * 0.1
            };
        }
        /**
         * removeScatter
         */
        function removeScatter(){
            d3.selectAll('.axis').remove();
        }

        /**
         * updateDimensions
         */
        function updateDimensions() {
            fullH = parseFloat(scope.height) || chartDiv.parentElement.clientHeight || 500;
            fullW = parseFloat(scope.width) || chartDiv.parentElement.clientWidth || 500;
            m = {top:scope.marginTop||20,right:scope.marginRight||20,bottom:scope.marginBottom||20,left:scope.marginLeft||20}; // margins
            w = fullW - m.left - m.right;
            h = fullH - m.top - m.bottom;
            updateScale();
            if(tm==null){
                tm = setTimeout(function(){
                    animate();
                },1000);
            }
        }



        /**
         * updateScale
         */
        function updateScale(){
            boundingRadius = radiusScale((totalValue/2));
            centerX = fullW/centerX_Divider;
            centerY = fullH/centerY_Divider
            //TODO: redo scale based on size
            var rangeHigh = 55;
            var rangeLow = 10;
            changeScale(0);
            var rDom = [2,15];
            if(data.length>0){
                rDom = d3.extent(data,function(d){return d.metrics[scope.domainMetric];});
                var fillDomain = d3.extent(data,function(d){return d.metrics[scope.colorMetric.fill];});
                var strokeDomain = d3.extent(data,function(d){return d.metrics[scope.colorMetric.stroke];});

                fillColor = d3.scale.linear().domain(fillDomain).range(scope.colorFill.range);
                strokeColor = d3.scale.ordinal().domain(strokeDomain).range(scope.colorStroke.range);
                rScale = d3.scale.pow().exponent(0.5).domain(rDom).range([rangeLow,rangeHigh]);
                var totalArea = h*w;
                var cirArea = 0;
                for(var cir in data){
                    var r = rScale(data[parseFloat(cir)].metrics[scope.radiusScaleMetric]);
                    cirArea+=(Math.PI*Math.pow(r,2));
                }
                if(cirArea>=totalArea){
                    rangeHigh = 15;
                    rangeLow = 5;
                }else if(data.length>150){
                    rangeHigh = 15;
                    rangeLow = 5;
                }
            }
            rScale = d3.scale.pow().exponent(0.5).domain(rDom).range([rangeLow,rangeHigh]);
        }

        /**
         * createLegend
         */
        function createLegend(){
            if(data.length>0){
                var fields = _.keys(data[0].fields);
                var metrics = _.keys(data[0].metrics);

            d3.select('.legend').transition().duration(1000).attr("opacity",0).remove();

            var legend = svgContainer.append("g")
                .attr("class","legend")
                .attr("height",100)
                .attr("with",100)
                .attr("transform",'translate(-20,50)');
            legend.selectAll('rect')
                .data(scope.legendData)
                .enter()
                .append("rect")
                .attr("x",w-65)
                .attr("y",function(d,i){return i*20;})
                .attr("width",10)
                .attr("height",10)
                .style("fill",function(d){return 'orange';});
            legend.selectAll('text')
                .data(scope.legendData)
                .enter()
                .append("text")
                .attr("x",w-52)
                .attr("y",function(d,i){return i*20+9;})
                .text(function(d){
                    return d.label;
                });

            var rDom = d3.extent(data,function(d){return d.metrics[scope.domainMetric];});
            var radVals = [rDom[1],((rDom[1]+rDom[0])/2),rDom[0]];

            d3.select('.radLegend').transition().duration(1000).attr("opacity",0).remove();

            d3.select(".colorLegend").transition().duration(1000).attr("opacity",0).remove();
            var colorLegend = svgContainer.append("g")
                .attr("class","colorLegend");

            colorLegend.selectAll("colorSwatch")
                .data(radVals)
                .enter()
                .append("svg:rect")
                .attr("class","colorSwatch")
                .attr("x",function(d,i){
                    return (w-80)+i*32;
                })
                .attr("y",h/2)
                .attr("width",30)
                .attr("height",15)
                .style("fill",function(d){return fillColor(d);});

            var radLegend = svgContainer.append("g")
                .attr("class","radLegend");

            var xPos = w-65;
            var yPos = h-m.bottom;

            radLegend.selectAll("markerCircles")
                .data(radVals)
                .enter()
                .append("svg:circle")
                .attr('r', function(d){return radiusScale(d);})
                .style("stroke-dasharray",("3,3"))
                .style("stroke-width",".5px")
                .style("fill","none")
                .style("stroke","black")
                .attr('cx', xPos)
                .attr('cy', function(d,i){return (yPos-30)+(i*30);});

            radLegend.selectAll("markerLines")
                .data(radVals)
                .enter()
                .append("svg:line")
                .attr('x1',xPos)
                .attr('x2',xPos+50)
                .attr("y1",function(d,i){return (yPos-30)+(i*30);})
                .attr("y2",function(d,i){return (yPos-30)+(i*30);})
                .style("stroke-width",".5px")
                .style("stroke-dasharray",("3,3"))
                .style("stroke", "black");

            radLegend.selectAll("text")
                .data(radVals)
                .enter()
                .append("text")
                .attr('x',xPos+50)
//                    .attr('y',yPos)
                .attr("y",function(d,i){return (yPos-30)+(i*30);})
                .text(function(d){return d;});

            }
        }

        /***
         * createToolTip
         */
        function createToolTip(){
            if(scope.tt){
                d3.select(el[0]).append("div:div")
                    .attr('id',el[0].id+'_tooltip')
                    .attr('class','tooltip left')
                    .style({'position':'absolute','left':0,'top':0,'display':'none'});
                d3.select("#"+el[0].id+"_tooltip").append("div:div").attr('id',el[0].id+'_tooltip_txt').attr("class","tooltip-inner").text("");
                d3.select("#"+el[0].id+"_tooltip").append("div:div").attr("class","tooltip-arrow");
            }
        }
        /***
         * showTooltip
         *
         */
        function showTooltip(item,swap,d,i){
            if(scope.tt){
                var m = d3.mouse(item);
                var top = m[1]-20;
                var left = m[0]+15;
                var text = d.name+"<br/>\n";

                var f = _.keys(d.fields);
                var m = _.keys(d.metrics);

                for (var i = 0;i< f.length;i++){
                    if(scope.timeMetric==m[i]){
                        text+= d.fields[f[i]] + " : " + moment(d.metrics[m[i]]).format("d MMM YYYY") + "<br />\n";
                    }else{
                        text+= d.fields[f[i]] + " : " + d.metrics[m[i]] + "<br />\n";
                    }

                }

                d3.select('#bubbleChart_tooltip_txt').style('text-align','left');
                d3.select('#bubbleChart_tooltip_txt').html(text);
                d3.select('#' + el[0].id + '_tooltip').classed('left', '');
                d3.select('#' + el[0].id + '_tooltip').classed('right', 'true');
                d3.select('#' + el[0].id + '_tooltip').classed('top', '');
                d3.select('#' + el[0].id + '_tooltip').classed('bottom', '');
                d3.select('#'+el[0].id+'_tooltip').style("left",left+'px');
                d3.select('#'+el[0].id+'_tooltip').style("top",top+'px');
                d3.select('#'+el[0].id+'_tooltip').style("display","block");
            }
        }
        /***
         * hideTooltip
         */
        function hideTooltip(item){
            if(scope.tt){
                d3.select('#'+el[0].id+'_tooltip').style("display","none");
            }
        }
        //TODO: add ability to pass is your own layout and sort function
        /**
         * setLayout
         */
        function setLayout(){
            scope.layout([
                {name:'totalLayout',func:totalLayout,clear:function(){return;}},
                {name:'typeLayout',func:typeLayout,clear:function(){return;}},
                {name:'metricLayout',func:metricLayout,clear:function(){return;}},
                {name:'scatterLayout',func:scatterLayout,clear:removeScatter}
            ],scope);
        }

        scope.$watch('width', updateDimensions);
        scope.$watch('data',function(){
            if(data.length>0){
                if(tm==null){
                    tm = setTimeout(function(){
                        animate();
                    },1000);
                }
            }
        });
        scope.$watch('render',function(){
            if(tm==null){
                tm = setTimeout(function(){
                    animate();
                },1000);
            }
        });
    }

    return {
        restrict: 'EA',
        scope: {
            render:'=',
            layout:'=',       // function is called after animation to call a force layout
            click:'=',        // function called when bubble is clicked
            data: '=',
            // READ-ON-LOAD ATTRIBUTES
            legendData:'=',
            layoutMetrics:'=',
            randomData:'=',
            changeCatMetric:'=',
            radiusScaleMetric:'=',
            domainMetric:'=',
            valueMetric:'=',
            timeMetric:'=',
            colorMetric:'=',
            marginLeft:'=',
            marginRight:'=',
            marginTop:'=',
            marginBottom:'=',
            colorFill:'=',
            colorStroke:'=',
            colors:'=',        // color array for metrics
            color: '=',       // (2 in color precedence) a flat color
            colorRange: '=',  // (3) (default) color spread with one color
            colorHigh: '=',   // (1) color spread with two colors
            colorLow: '=',    // (1) the lower bound for the spread (defaults to black)
            chartId: '=',     // an id for the chart
            height: '=',      // the height of the SVG
            width: '=',        // the width of the SVG
            tt: '='           // enable tooltip(true/false)
        },
        link: link
    };
}]);
