/**
 * Created by matthew.sanders on 7/25/16.
 */
var app = angular.module('playGroundApp');

app.factory('socketService', function( $http, $q, $location, $log, config ) {
  var service = {};
  var url = config.api.urlLocal;
  service.getUsers = function( data ){
    var d = $q.defer();
    var _url = url + 'getUserList';
    $http.get( _url, data).success( function( data, status, headers, config ) {
      d.resolve(data);
    })
    .error( function( err, code ) {
      d.reject( err );
      $log.error( err);
    });

    return d.promise;
  };


  return service;
});