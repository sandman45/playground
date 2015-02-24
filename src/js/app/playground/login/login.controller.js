/**
 * Created by matthew.sanders on 2/20/15.
 */
controllers.controller('loginCtrl', ['$scope', 'service', '$location', '$modal', '$log', 'model',
  function($scope, service, $location, $modal, $log, model) {

    $scope.alerts = [];

    $scope.closeAlert = function(i){
      $scope.alerts.splice(i,1);
    };


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

    $scope.login = function(){
      var userObj = {
        email:$scope.email,
        password:$scope.password
      };
      service.login(userObj).then(function(data){
        $log.info(data);
        if(data==="Success"){
          service.getUser($scope.email).then(function(data){
            $log.info(data);
            model.user = data;
            $location.path('/playground/paleo');
          }, function( err ){
            $log.error( err );
            $scope.alerts.push( { type:'danger', msg:err } );
            //show alert
          })
        }else{
          $log.error( err );
          $scope.alerts.push( { type:'danger', msg:err } );
        }
        model.user = data;
      },function( err ) {
        $log.error( err );
        $scope.alerts.push( { type:'danger', msg:err } );
      });
    };
  }]);