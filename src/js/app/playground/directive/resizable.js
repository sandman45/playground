/**
 * Created by matthew.sanders on 11/10/14.
 */
angular.module('playGroundApp').directive('resizable',
  function ($window) {

    function getComputedStyle(element,styleProp){
      return $window.getComputedStyle(element,null).getPropertyValue(styleProp);
    };

    return function(scope,element){
      var fluidDiv = element[0];

      function applyScopeVars(){
        scope.width = $window.innerWidth;
        scope.height = $window.innerHeight;
        scope['fluidHeight_'+ element[0].id] = parseInt(getComputedStyle(fluidDiv,'height'),10);
        scope['fluidWidth_'+ element[0].id] = parseInt(getComputedStyle(fluidDiv,'width'),10);
        //console.log(scope['fluidWidth_'+ element[0].id]);
      }

      angular.element($window).bind('resize',function(){
        scope.$apply(function(){
          applyScopeVars();
        })
      });
      applyScopeVars();

    }
  });