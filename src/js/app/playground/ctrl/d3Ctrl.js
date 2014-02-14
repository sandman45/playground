/**
 * Created by matthew.sanders on 1/31/14.
 */
controllers.controller('d3Ctrl', ['$scope',//$http,$routParams
    function($scope) {
        $scope.title = 'Bubbles';
        $scope.fluidWidth_bubbleContainer = 800;
        window.onresize = function(e){$scope.fluidWidth_bubbleContainer = parseFloat(d3.select("#container").style("width"));$scope.$apply();};

        /**
         * buttons
         * each object in the array consists of:
         * - the label of the button
         * - type - function that will be called within the bubbleChart
         * - active - if the button is active(selected) or not
         * @type {Array}
         */
        $scope.buttons = [
            {
                label:"Gather in the center",
                type:'totalLayout',
                active:true
            },
            {
                label:"Split Credit Score",
                type:'typeLayout',
                active:false
            },
            {
                label:"Split Account Age",
                type:'metricLayout',
                active:false
            },
            {
                label:"Scatter Plot",
                type:'scatterLayout',
                active:false
            }
        ];
        /**
         * cOptions
         * @type {{render: boolean, timeMetric: string, changeCategoryMetric: string, radiusScaleMetric: string, domainMetric: string, colorMetric: {stroke: string, fill: string}, valueMetric: string, layoutMetrics: Array, metrics: Array, accountMetrics: Array, colorFill: {domain: Array, range: Array}, colorStroke: {domain: Array, range: Array}, colorHigh: string, colorLow: string, chartLabel: string, data: Array, layout: Function, click: Function, mouseOver: Function, mouseOut: Function}}
         */
        $scope.cOptions = {
            render:true,
            timeMetric:'metric4',               //this metric must be a time for it to work properly
            changeCategoryMetric:'metric1',     //sets category color range based on this metric *note this must be the same metric as the domain metric for this to work properly
            radiusScaleMetric:'metric1',        //sets bubble radius on this metric
            domainMetric:'metric1',             //sets domains based on this metric
            colorMetric:{stroke:'metric1',fill:'metric1'},              //sets metric to be used for the colors of the bubble fill
            valueMetric:'metric1',              //sets value metric.. this also affects the charge of the bubble
            layoutMetrics:['metric1','metric3','metric2',['metric3','metric1','metric1','metric4']],  //metrics that the layout functions will use order matters// first index is for typeLayout, second index is for metricLayout
            metrics:[{metric1:'count',label:'Accounts'},{metric2:'term',label:'Term'}],
            legendData:[],
            accountMetrics:[{metric1:'customer.credit_score',label:'Credit Score'},{metric2:'system.size',label:'System Size'},{metric3:'account.age',label:'Account Age'},{metric4:'date.creation.complete',label:'Creation Complete'}],
            colorFill:{domain:[ 0,1 ],range:["steelblue","red" ]}, //color fill domain and range.. domain is set dynamically
            colorStroke:{domain:[1,0],range:["black","black"]},
            colorHigh: '#ff8200',
            colorLow: '#77c0d5',
            chartLabel:'Bubble Chart',
            data:[],
            layout:function(arr){
                for(var button in $scope.buttons){
                    if($scope.buttons[button].active){
                        for(var func in arr){
                            arr[func].clear();
                        }
                        for(var func in arr){
                            if($scope.buttons[button].type==arr[func].name){
                                arr[func].func();
                                return;
                            }
                        }
                    }
                }
            },
            click:function(d){
                console.log(d.name);
                //drill into selected Circle
//                if(!pause){
//                    pause=true;
//                    hierarchyFilters.push(ejs.TermFilter($scope.hierarchy['level'+currentDrillLevel].term, d.name));
//                    currentDrillLevel++;
//                    if(currentDrillLevel==3){
//                        $scope.cOptions.changeCategoryMetric='metric1';
//                        $scope.cOptions.radiusScaleMetric='metric1';
//                        useHits=true;
//                        $scope.termVal = d.name;
//                        $scope.field = $scope.hierarchy['level'+currentDrillLevel].term;
//                    }else{
//                        useHits=false;
//                        $scope.cOptions.changeCategoryMetric='metric1';
//                        $scope.cOptions.radiusScaleMetric='metric1';
//                    }
//                    $scope.breadCrumbs+= d.name + " > ";
//                    $scope.drillButtons.push($scope.hierarchy['level'+currentDrillLevel]);
//                    $scope.loading="Retrieving";
//                    $scope.$apply();
//                    getData(filters.concat(hierarchyFilters));
//                }
            },
            mouseOver: function (d, i) {

            },
            mouseOut: function (d, i) {

            }
        };

        /**
         * triggerLayout
         * sets the layout to use and then
         * causes directive to render
         * @param report
         */
        $scope.triggerLayout = function (report) {
            for(var button in $scope.buttons){
                $scope.buttons[button].active = false;
            }
            report.active = true;
            $scope.cOptions.render?$scope.cOptions.render=false:$scope.cOptions.render=true;
        };

        var data = bumpLayer(2,2);

        /**
         * bumpLayer
         * Inspired by Lee Byron's test data generator.
         * @param n
         * @param o
         * @returns {*|Array}
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
            return a.map(function(d, i) { return {x: i, y: parseFloat(Math.max(0, d).toFixed(0))}; });
        }



    }]);