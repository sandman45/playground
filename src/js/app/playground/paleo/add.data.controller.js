/**
 * Created by matthew.sanders on 2/24/15.
 */
controllers.controller('addDataCtrl', ['$scope', '$modalInstance', 'service', '$location', '$log', 'utils',
  function($scope, $modalInstance, service, $location, $log, utils) {

    $scope.alerts = [];
    $scope.dt = moment();
    $scope.value = 0 ;
    $scope.closeAlert = function( i ) {
      $scope.alerts.splice( i, 1 );
    };

    $scope.add = function(){

      $log.info($scope.dt);
      $log.info($scope.value);
      service.insertPaleoData( { datetime: moment($scope.dt).unix(), value: $scope.value } ).then( function ( data ) {
        $log.info(data);
        $modalInstance.dismiss();
      }, function( err ) {
        $log.error( err );
      });

    };
    $scope.cancel = function() {
      $modalInstance.dismiss();
    };
  }]);