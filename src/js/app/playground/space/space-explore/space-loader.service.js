/**
 * Created by matthew.sanders on 4/24/15.
 */
var app = angular.module('playGroundApp');

app.factory('spaceLoader', function( $q, $log ) {

  var service = {};

  service.loadModel = function( scene, objects, model, position, id){
    var loader = new THREE.ObjectLoader();
    loader.load(model.path,function ( obj ) {
      obj.position.x = position.x;
      obj.position.y = position.y;
      obj.position.z = position.z;
      obj.name = "tie"+id;
      objects.push(obj);
      scene.add( obj );
      $log.info("Object Loaded");
    });
  };

  return service;
});
