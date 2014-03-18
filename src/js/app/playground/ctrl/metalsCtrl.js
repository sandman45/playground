/**
 * Created by matthew.sanders on 2/14/14.
 */
/**
 * Created by matthew.sanders on 1/31/14.
 */
controllers.controller('metalsCtrl', ['$scope','$http',//$routParams
    function ($scope, $http) {
        $scope.title = 'Metals';


        $scope.data = [];
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
                for(var i=0;i<1000;i++){
                    testData.push(
                        {
                            key: data.data[i][0],
                            x: data.data[i][0],
                            y: data.data[i][1],
                            xLabel:data.data[i][0],
                            tooltip:"Silver",
                            unit:'$'
                        });
                }
                $scope.data.push(testData);
            })
            .error(function(data,status,headers,config){
                console.log("error getting metals feed");
            });

//        $http({
//            method:'GET',
//            url:'http://www.quandl.com/api/v1/datasets/OFDP/GOLD_2.json?&trim_start=1968-04-01&trim_end=2014-03-14&sort_order=desc',
//            headers:{
//                'Access-Control-Allow-Origin': '*',
//                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//                'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
//            }
//        })
//            .success(function(data,status,headers,config){
//               // console.log(JSON.stringify(data));
//            })
//            .error(function(data,status,headers,config){
//                console.log("error getting metals feed");
//            });
//
//        $http({
//            method:'GET',
//            url:'http://www.quandl.com/api/v1/datasets/JOHNMATT/PLAT.json?&trim_start=1992-07-01&trim_end=2014-03-14&sort_order=desc',
//            headers:{
//                'Access-Control-Allow-Origin': '*',
//                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//                'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
//            }
//        })
//            .success(function(data,status,headers,config){
//               // console.log(JSON.stringify(data));
//            })
//            .error(function(data,status,headers,config){
//                console.log("error getting metals feed");
//            });






    }]);