/**
 * Created by matthew.sanders on 2/14/14.
 */
/**
 * Created by matthew.sanders on 1/31/14.
 */
controllers.controller('metalsCtrl', ['$scope','$http',//$routParams
    function ($scope, $http) {
        $scope.title = 'Metals';


        var data = {
            "aud": {
                "gold": 46.888645547621,
                "palladium": 26.247101503873,
                "platinum": 50.677915679779,
                "silver": 0.75483221631472
            },
            "brl": {
                "gold": 100.61768346134,
                "palladium": 56.323285094941,
                "platinum": 108.74902481817,
                "silver": 1.619783811636
            },
            "cad": {
                "gold": 46.456861051117,
                "palladium": 26.005399245785,
                "platinum": 50.211236848474,
                "silver": 0.74788117636337
            },
            "chf": {
                "gold": 37.791913943643,
                "palladium": 21.154976641349,
                "platinum": 40.846038648489,
                "silver": 0.60838938356373
            },
            "cny": {
                "gold": 256.39511295959,
                "palladium": 143.52362872399,
                "platinum": 277.11548848382,
                "silver": 4.1275513316118
            },
            "eur": {
                "gold": 30.909082595017,
                "palladium": 17.30213826371,
                "platinum": 33.406976533343,
                "silver": 0.49758680480024
            },
            "gbp": {
                "gold": 25.27916575338,
                "palladium": 14.150650369892,
                "platinum": 27.322082255583,
                "silver": 0.40695414613398
            },
            "inr": {
                "gold": 2621.2646539963,
                "palladium": 1467.318977514,
                "platinum": 2833.1001580051,
                "silver": 42.198169412122
            },
            "jpy": {
                "gold": 4310.853464197,
                "palladium": 2413.1089120112,
                "platinum": 4659.231799404,
                "silver": 69.397847529697
            },
            "mxn": {
                "gold": 560.96554425533,
                "palladium": 314.01460648487,
                "platinum": 606.29954691613,
                "silver": 9.0306482539872
            },
            "rub": {
                "gold": 1486.2793987606,
                "palladium": 831.98236559776,
                "platinum": 1606.3919349192,
                "silver": 23.926721694061
            },
            "usd": {
                "gold": 42.32967,
                "palladium": 23.6951,
                "platinum": 45.75051,
                "silver": 0.68144
            },
            "zar": {
                "gold": 460.01767264963,
                "palladium": 257.50649025141,
                "platinum": 497.19365005051,
                "silver": 7.4055489412123
            }
        };


        var pair = _.pairs(data);
        var testData = [];
        for(var item in pair){

            testData.push(
                {
                    key: pair[item][0],
                    x: moment(),
                    y: pair[item][1].gold,
                    xLabel:moment().format("DD-MM-YYYY"),
                    tooltip:"Gold",
                    unit:'$'
                });
        }

        $scope.data = [testData];


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
            width: '701',
            height: '230',
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
//        $http({
//            method:'GET',
//            url:'http://www.xmlcharts.com/cache/precious-metals.php?format=json',
//            headers:{
//                'Access-Control-Allow-Origin': '*',
//                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//                'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
//                }
//            })
//            .success(function(data,status,headers,config){
//                console.log(JSON.stringify(data));
//            })
//            .error(function(data,status,headers,config){
//                console.log("error getting metals feed");
//            });

//        $scope.data = "unknown";
//        $http.get('http://www.xmlcharts.com/cache/precious-metals.php?format=json').success(function(data,status,headers,config){
//            $scope.data=data;
//        }).error(function(data,status,headers,config){
//                $scope.data=data;
//            });







    }]);