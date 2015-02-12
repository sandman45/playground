/**
 * Created by matthew.sanders on 10/24/14.
 */
controllers.controller('paleoCtrl',
  function ($scope, $q, $window) {

    $scope.title = "Paleo Chart";
    $scope.fluidWidth_main = $window.innerWidth;



//    $scope.data = generateData(1,100,0,40,0,50,'orange','test data');
    $scope.data = generateRandomLinearData(2,[moment(),moment()],1,'months',300,200,12,['red','blue'],['nancy','john']);
    //TODO: get our line chart in here
    $scope.cOptions = {
      data:$scope.data,
      lineOpacity:1,
      lineWidth:2,
      tooltipLeft: 'left',
      tooltipTop: 'top',
      tooltipRight: 'right',
      tooltipBottom: 'bottom',
      time: 1000,
      innerText: '',
      dataFormat: '0,000',
      pointOpacity: 1,
      pointRadius: 4,
      colorLow:'orange',
      colorHigh:'blue',
      mouseOver:function(d,i){
        console.log(d);
      },
      mouseOut:function(d,i){
        console.log(d);
      }
    };


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
});
