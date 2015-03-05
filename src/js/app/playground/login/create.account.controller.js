/**
 * Created by matthew.sanders on 2/20/15.
 */
controllers.controller('createAccountCtrl', ['$scope', '$modalInstance', 'service', '$location', '$log', 'utils',
  function($scope, $modalInstance, service, $location, $log, utils) {

    $scope.alerts = [];

    $scope.closeAlert = function(i){
      $scope.alerts.splice(i,1);
    };

    $scope.create = function(){
      var userObj = {
        email: $scope.email,
        password: $scope.pass1,
        username:$scope.username,
        firstname:$scope.firstname,
        lastname:$scope.lastname,
        phone:$scope.phone
      };
      if(validate(userObj)){
        service.insertUser(userObj).then(function(){
          $modalInstance.dismiss();
        }, function(err){
          $log.error(err);
          $modalInstance.dismiss();
        });
      }else{
        $log.info("invalid password and other stuff show notification here.");
      }
    };

    $scope.cancel = function(){
      $modalInstance.dismiss();
    };

    var validate = function(userObj){
      var valid = false;
      if(utils.validateEmail(userObj.email)){
        valid = true;
      }else{
        $scope.alerts.push({type:'danger',msg:'Invalid email format. Should be XXXX@XXXX.com, or XXX.XXXXX@XXXX.com'});
        valid = false
      }
      if(userObj.password && userObj.password === $scope.pass2){
        valid = true;
      }else{
        $scope.alerts.push({type:'danger',msg:'Passwords do not match'});
        valid = false
      }
      if(userObj.username && userObj.username.length>0){
        valid = true;
      }else{
        $scope.alerts.push({type:'danger',msg:'Username is blank'});
        valid = false
      }
      if(userObj.firstname && userObj.firstname.length>0){
        valid = true;
      }else{
        $scope.alerts.push({type:'danger',msg:'First Name is blank'});
        valid = false
      }
      if(userObj.lastname && userObj.lastname.length>0){
        valid = true;
      }else{
        $scope.alerts.push({type:'danger',msg:'Last Name is blank'});
        valid = false
      }
      if(utils.validatePhone(userObj.phone)){
        valid = true;
      }else{
        $scope.alerts.push({type:'danger',msg:'Invalid phone format. Should be XXX-XXX-XXXX, XXX.XXX.XXXX, XXX XXX XXXX'});
        valid = false
      }
      return valid;
    }

  }]);