/**
 * Created by matthew.sanders on 2/23/15.
 */
angular.module('playGroundApp').controller('navbarCtrl', function ($scope, $log, $location, service, model) {
  $scope.model = model;
  $scope.$watch('model', function(data){
    if(!data.user.email){
      service.getUser('refresh').then(function(data){
        $log.info(data);
        model.user = data;
        model.user.loggedIn = true;
        model.user.firstname;
        model.user.lastname;
      });
    }
  });
  $scope.logout = function(){
    service.logout().then(function(data){
      $log.info(data);
      model.user = {};
      $location.path('/index');
    }, function(err){
      $log.error(err)
    });
  }
});