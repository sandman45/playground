/**
 * Created by matthew.sanders on 2/20/15.
 */
controllers.controller('loginCtrl', ['$scope', 'service', '$location', '$modal', '$log',
  function($scope, service, $location, $modal, $log) {



    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: '/js/app/playground/login/createAccountModal.html',
        controller: 'createAccountCtrl',
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
        $log.info('Modal dismissed at: ' + new Date());
      });
    };





  }]);