/**
 * Created by matthew.sanders on 10/24/14.
 */
controllers.controller('paleoCtrl',
  function ($scope, $q, $window, service, model, utils, $modal, $log) {

    var dataRanges = {
      range1:'lifetime',
      range2:'6months',
      range3:'3months',
      range4:'1month'
    };

    var selectedRange = dataRanges.range1;

    $scope.model = model;
    $scope.title = "Paleo Chart";
    $scope.lineChartData = [];
    $scope.lineChartOptions = {
      "chart": {
        "type": "lineChart",
        "height": 450,
        "margin": {
          "top": 20,
          "right": 20,
          "bottom": 40,
          "left": 55
        },
        "useInteractiveGuideline": true,
        "dispatch": {},
        "xAxisTickFormat":$scope.dateFormat,
        "xAxis": {
          "axisLabel": "Time (ms)",
          "showMaxMin":false,
          "tickFormat": function(d){
            return d3.time.format('%x')(new Date(d));
          }
        },
        "yAxis": {
          "axisLabel": "Weight (lbs)",
          "axisLabelDistance": 30
        },
        "transitionDuration": 250
      },
      "title": {
        "enable": true,
        "text": "Paleo Weight Line Chart"
      },
      "subtitle": {
        "enable": true,
        "text": "This is your weight over time",
        "css": {
          "text-align": "center",
          "margin": "10px 13px 0px 7px"
        }
        //},
        //"caption": {
        //  "enable": true,
        //  "html": "<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style=\"text-decoration: underline;\">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style=\"color: darkred;\">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href=\"https://github.com/krispo/angular-nvd3\" target=\"_blank\">2</a>, 3]</sup>.",
        //  "css": {
        //    "text-align": "justify",
        //    "margin": "10px 13px 0px 7px"
        //  }
      }
    };
    $scope.color1 = "#FF9933";
    $scope.color2 = "#ADD8E6";
    $scope.dataFormat = "ddd MMM DD YYYY";
    $scope.init = function(){
      getData().then(function(data){
        prepareChartData(data,selectedRange);
      }, function(err){
        $log.error( err );
      });
    };

    var getData = function(){
      var def = $q.defer();
      service.getPaleoResults( model.user._id ).then( function( data ) {
        def.resolve( data );
      }, function( err ){
        $log.error( err );
        def.reject( err );
      });
      return def.promise;
    };

    var prepareChartData = function(data){
      var average = [];
      var temp = [];
      if(data.length>0){
        _.forEach( data, function( d ) {
          temp.push({label:moment.unix(d.datetime).format($scope.dateFormat), x: moment.unix(d.datetime), y: d.value});
        });
        temp.sort( function( a, b ) {
          return a.x - b.x;
        });

        //trim data...
        if(selectedRange === dataRanges.range2){
          var todaysDate = moment();
          var start = moment().subtract(6,'months');
          var dateBoundaries = {start:start, end:todaysDate};
          var trimmed = [];

          console.log('END - ' + todaysDate.format('Do MMM YYYY'));
          console.log('START - ' +start.format('Do MMM YYYY'));

          _.each(temp,function(item){
            // console.log(moment(item.x).format('Do MMM YYYY'));
            if(moment(item.x).utc() >= moment(dateBoundaries.start).utc() &&  moment(item.x).utc() <=  moment(dateBoundaries.end).utc()){
              trimmed.push(item);
            }
          });

          temp = trimmed;
        }

        average.push({ label:"Average", x: temp[0].x, y: temp[0].y });
        for(var i = 1; i < temp.length-1; i++ ){
          var avg = utils.approxRollingAverage( temp, i );
          //console.log(avg);
          average.push( { label:"Average", x: temp[i].x, y: avg } );
        }
        average.push({ label:"Average", x: temp[temp.length-1].x, y: temp[temp.length-1].y });

        $scope.lineChartData = [
          {
            color:$scope.color1,
            key:"weight",
            values:temp
          },
          {
            color:$scope.color2,
            key:"moving average",
            values:average
          }
        ];
        $scope.average = utils.calculateAverage(data).toFixed(2);
      }

    };

    $scope.config = {
      visible: true, // default: true
      extended: false, // default: false
      disabled: false, // default: false
      autorefresh: true, // default: true
      refreshDataOnly: false // default: false
    };

    $scope.options1 = {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 55
        },
        x: function(d){ return d.label; },
        y: function(d){ return d.value; },
        showValues: true,
        valueFormat: function(d){
          return d3.format(',.4f')(d);
        },
        transitionDuration: 500,
        xAxis: {
          axisLabel: 'X Axis'
        },
        yAxis: {
          axisLabel: 'Y Axis',
          axisLabelDistance: 30
        }
      }
    };

    $scope.data1 = [
      {
        key: "Cumulative Return",
        values: [
          {
            "label" : "A" ,
            "value" : -29.765957771107
          } ,
          {
            "label" : "B" ,
            "value" : 0
          } ,
          {
            "label" : "C" ,
            "value" : 32.807804682612
          } ,
          {
            "label" : "D" ,
            "value" : 196.45946739256
          } ,
          {
            "label" : "E" ,
            "value" : 0.19434030906893
          } ,
          {
            "label" : "F" ,
            "value" : -98.079782601442
          } ,
          {
            "label" : "G" ,
            "value" : -13.925743130903
          } ,
          {
            "label" : "H" ,
            "value" : -5.1387322875705
          }
        ]
      }
    ];

    $scope.options2 = {
      chart: {
        type: 'historicalBarChart',
        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 50
        },
        x: function(d){return d[0];},
        y: function(d){return d[1]/100000;},
        showValues: true,
        valueFormat: function(d){
          return d3.format(',.1f')(d);
        },
        transitionDuration: 500,
        xAxis: {
          axisLabel: 'X Axis',
          tickFormat: function(d) {
            return d3.time.format('%x')(new Date(d))
          },
          rotateLabels: 50,
          showMaxMin: false
        },
        yAxis: {
          axisLabel: 'Y Axis',
          axisLabelDistance: 35,
          tickFormat: function(d){
            return d3.format(',.1f')(d);
          }
        }
      }
    };

    $scope.data2 = [
      {
        "key" : "Quantity" ,
        "bar": true,
        "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
      }];

    $scope.options3 = {
      "chart": {
        "type": "pieChart",
        "height": 500,
        "showLabels": true,
        "transitionDuration": 500,
        "labelThreshold": 0.01,
        "legend": {
          "margin": {
            "top": 5,
            "right": 35,
            "bottom": 5,
            "left": 0
          }
        }
      }
    };

    $scope.data3 = [
      {
        key: "One",
        y: 5
      },
      {
        key: "Two",
        y: 2
      },
      {
        key: "Three",
        y: 9
      },
      {
        key: "Four",
        y: 7
      },
      {
        key: "Five",
        y: 4
      },
      {
        key: "Six",
        y: 3
      },
      {
        key: "Seven",
        y: .5
      }
    ];

//
////    $scope.data = generateData(1,100,0,40,0,50,'orange','test data');
//    $scope.cData = generateRandomLinearData(2,[moment(),moment()],1,'months',300,200,12,['red','blue'],['nancy','john']);

    /**
     * generateData
     * @param noOfArray
     * @param xMax
     * @param xMin
     * @param yMax
     * @param yMin
     * @param rangeTotal
     * @param color
     * @param labels
     * @returns {Array}
     */
    function generateData(noOfArray,xMax,xMin,yMax,yMin,rangeTotal,color,labels){
      var genData = [];
      var randomNum = function(max,min){return Math.random() * (max-min)+min;}
      for(var i = 0; i<noOfArray; i++){
        var tempArray=[];
        for(var j = 0; j<rangeTotal; j++){
          tempArray.push({x:randomNum(xMax,xMin),y:randomNum(yMax,yMin),color:color,label:labels[i]});
        }
        genData.push(tempArray);
      }
      return genData;
    }

    /**
     * generateRandomLinearData
     * @param noOfArray
     * @param xMax
     * @param xMin
     * @param yMax
     * @param yMin
     * @param rangeTotal
     * @param color
     * @param labels
     * @returns {Array}
     */
    function generateRandomLinearData(noOfArray,beginDates,dateInterval,intervalType,yMax,yMin,rangeTotal,colors,labels){
      var genData = [];
      var randomNum = function(max,min){return Math.random() * (max-min)+min;}
      var date = function(date, interval, intervalType){
        var newMoment = date.add(interval,intervalType).clone();
       return newMoment._d;
      };
      for(var i = 0; i<noOfArray; i++){
        var tempArray=[];
        for(var j = 0; j<rangeTotal; j++){
          tempArray.push({x:date(beginDates[i],dateInterval,intervalType),y:randomNum(yMax,yMin),color:colors[i],label:labels[i]});
        }
        genData.push(tempArray);
      }
      return genData;
    }


    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: '/js/app/playground/paleo/addDataModal.html',
        controller: 'addDataCtrl',
        size: size,
        resolve: {
          items: function () {
            return [];
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed');
        $scope.init();
      });
    };

    //BMI Modal
    $scope.openBMI = function (size) {

      var bmiModalInstance = $modal.open({
        templateUrl: '/js/app/playground/paleo/bmiModal.html',
        controller: 'bmiModalCtrl',
        size: size,
        resolve: {
          data: function () {
            return {
              mass: $scope.average
            };
          }
        }
      });

      bmiModalInstance.result.then(function (data) {
        $scope.bmi = utils.calculateBMI(data.type, data.height, data.mass).toFixed(2);
      }, function () {
        $log.info('Modal dismissed');
        $scope.init();
      });
    };


    $scope.getAllData = function(){
      selectedRange = dataRanges.range1;
      $scope.init();
    };

    $scope.trimData = function(){
      selectedRange = dataRanges.range2;
      $scope.init();
    };


    $scope.init();
});
