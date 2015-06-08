/**
 * Created by matthew.sanders on 6/8/15.
 */
controllers.controller('recipeCtrl',
  function ($scope, $q, $window, service, model, utils, $modal, $log) {

  $scope.title = "Recipes";

  $scope.init = function(){
    getData().then(function(data){

    }, function(err){
      $log.error( err );
    });
  };

  $scope.open = function ( size ) {

    var modalInstance = $modal.open({
      templateUrl: '/js/app/playground/recipe/addRecipeModal.html',
      controller: 'addRecipeCtrl',
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











  var getData = function(){
    var def = $q.defer();
    service.getRecipes( model.user._id ).then( function( data ) {
      def.resolve( data );
    }, function( err ){
      $log.error( err );
      def.reject( err );
    });
    return def.promise;
  };

  $scope.init();
});
