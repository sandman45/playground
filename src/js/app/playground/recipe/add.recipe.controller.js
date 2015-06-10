/**
 * Created by matthew.sanders on 6/8/15.
 */
controllers.controller('addRecipeCtrl', ['$scope', '$modalInstance', 'service', '$location', '$log', 'utils', 'recipeObject', 'lodash',
  function($scope, $modalInstance, service, $location, $log, utils, recipeObject, lodash) {



    $scope.alerts = [];
    $scope.dt = moment();
    $scope.value = 0 ;
    $scope.closeAlert = function( i ) {
      $scope.alerts.splice( i, 1 );
    };

    $scope.init = function(){

      $scope.recipe = lodash.cloneDeep(recipeObject.recipe);

      $scope.recipe.ingredients.push(lodash.cloneDeep(recipeObject.ingredient));



    };


    $scope.add = function(){

      $log.info($scope.dt);
      $log.info($scope.value);
      service.insertRecipe( { datetime: moment($scope.dt).unix(), value: $scope.value } ).then( function ( data ) {
        $log.info(data);
        $modalInstance.dismiss();
      }, function( err ) {
        $log.error( err );
      });

    };

    $scope.addIngredient = function(){
      $scope.recipe.ingredients.push(lodash.cloneDeep(recipeObject.ingredient));
    };

    $scope.removeIngredient = function(index){
      $scope.recipe.ingredients.splice(index,1);
    };



    $scope.capture = function(){
      var cameraCapture = document.querySelector('input[id=cameraCapture]');

      cameraCapture.onchange = function(){
        if(cameraCapture.files.length > 0){
          var file = cameraCapture.files[0];
          var imgURL = URL.createObjectURL(file);
          $scope.recipe.photo = file;
          $scope.image = imgURL;
          $scope.$apply();
        }
      };

      cameraCapture.click();
    };


    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

    $scope.init();
  }]);