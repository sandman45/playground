/**
 * Created by matthew.sanders on 2/14/14.
 */
/**
 * Created by matthew.sanders on 1/31/14.
 */
controllers.controller('metalsCtrl', ['$scope','$http',//$routParams
    function ($scope, $http) {
        $scope.title = 'Metals';
var bars = 50;

        function selectBtn(btn){

        }

        $scope.buttons = [
            {
                label:'Grouped',
                active:true,
                func:selectedBtn
            },
            {
                label:'Stacked',
                active:false,
                func:selectedBtn
            },
            {
                label:'Overlay',
                active:false,
                func:selectedBtn
            }
        ];



        $scope.data = [];
        var holder = [];
        var testData = [];

//        for(var item in data.data){
//            testData.push(
//                {
//                    key: data.data[item][0],
//                    x: data.data[item][0],
//                    y: data.data[item][1],
//                    xLabel:data.data[item][0],
//                    tooltip:"Silver",
//                    unit:'$'
//                });
//        }
//        $scope.data.push(testData);



        $scope.cOptions = {
            labelType:'onBa',
            colorHigh: "yellow",
            colorLow: "red",
            tooltipLeft: 'left',
            tooltipTop: 'top',
            tooltipRight: 'right',
            tooltipBottom: 'bottom',
            grouped:'grouped',
            stacked:'stacked',
            overlap:'overlap',
            width: 1200,
            height: 400,
            chartId: 'chart1',
            chartId2: 'chart2',
            chartId3: 'chart3',
            onClick: '',
            innerText: '',
            mouseOver: '',
            mouseOut: '',
            mouseOverLegend: '',
            mouseOutLegend: ''
        };
        $http({
            method:'GET',
            url:'/js/app/playground/data/gold.json',
            headers:{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
                }
            })
            .success(function(data,status,headers,config){
                var testData = [];
                for(var i=0;i<bars;i++){
                    testData.push(
                        {
                            key: data.data[i][0],
                            x: data.data[i][0],
                            y: data.data[i][1],
                            xLabel:data.data[i][0],
                            tooltip:"Gold",
                            color:"gold",
                            unit:'$'
                        });
                }
                holder.push(testData);
            })
            .error(function(data,status,headers,config){
                console.log("error getting metals feed");
            });

        $http({
            method:'GET',
            url:'/js/app/playground/data/silver.json',
            headers:{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
            }
        })
            .success(function(data,status,headers,config){
               // console.log(JSON.stringify(data));
                var testData2=[];
                for(var i=0;i<bars;i++){
                    testData2.push(
                        {
                            key: data.data[i][0],
                            x: data.data[i][0],
                            y: data.data[i][1],
                            xLabel:data.data[i][0],
                            tooltip:"Platinum",
                            color:"silver",
                            unit:'$'
                        });
                }
                holder.push(testData2);
            })
            .error(function(data,status,headers,config){
                console.log("error getting metals feed");
            });

        $http({
            method:'GET',
            url:'/js/app/playground/data/plat.json',
            headers:{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
            }
        })
            .success(function(data,status,headers,config){
               // console.log(JSON.stringify(data));
                var testData3=[];
                for(var i=0;i<bars;i++){
                    testData3.push(
                        {
                            key: data.data[i][0],
                            x: data.data[i][0],
                            y: data.data[i][1],
                            xLabel:data.data[i][0],
                            tooltip:"Platinum",
                            color:"steelblue",
                            unit:'$'
                        });
                }
                holder.push(testData3);
                $scope.data = holder;
            })
            .error(function(data,status,headers,config){
                console.log("error getting metals feed");
            });






    }]);