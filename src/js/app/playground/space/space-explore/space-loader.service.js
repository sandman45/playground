/**
 * Created by matthew.sanders on 4/24/15.
 */
var app = angular.module('playGroundApp');

app.factory('spaceLoader', function( $q, $log ) {

  var service = {};

  service.loadModel = function( scene, objects, model, position, rotation, id, name){
    var loader = new THREE.ObjectLoader();
    console.log(`model path: ${model.path}`);
    loader.load(model.path,function ( obj ) {
      obj.position.x = position.x;
      obj.position.y = position.y;
      obj.position.z = position.z;
      obj.rotation.y = rotation.y;
      obj.rotation.z = rotation.z;
      obj.rotation.x = rotation.x;
      if(id === 5){
        obj.scale.x = .001;
        obj.scale.y = .001;
        obj.scale.z = .001;
      }
      obj.name = name;
      objects.push(obj);
      scene.add( obj );
      $log.info("Object Loaded");
    });
  };

  return service;
});
