/**
 * Created by matthew.sanders on 2/24/15.
 */
controllers.controller('bmiModalCtrl', ['$scope', '$modalInstance', 'service', '$location', '$log', 'utils', 'data',
  function($scope, $modalInstance, service, $location, $log, utils, data) {

    $scope.height;
    $scope.mass = data.mass;
    $scope.type = 'merican';
    $scope.save = function(){

      $modalInstance.close({type: $scope.type, height: $scope.height, mass: $scope.mass});

    };
    $scope.cancel = function() {
      $modalInstance.dismiss();
    };
  }]);