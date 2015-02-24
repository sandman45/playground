/**
 * Created by matthew.sanders on 2/19/15.
 */
var app = angular.module('playGroundApp');

app.factory('service', function( $http, $q, $location, $log ) {
 var service = {};

  service.login = function( data ){
    var d = $q.defer();
    var url = "http://localhost:8081/login"
    $http.post( url, data).success( function( data, status, headers, config ) {
      d.resolve(data);
    })
    .error( function( err, code ) {
      d.reject( err );
      $log.error( err);
    });

    return d.promise;
  };


  service.getUser = function(id) {
    var d = $q.defer();
    var url = "http://localhost:8081/playground/user/"+id;
    $http.get( url ).success( function( data, status, headers, config ) {
      d.resolve(data);
    })
    .error( function( err, code ) {
      d.reject( err );
      $log.error( err);
    });

    return d.promise;
  };



  service.getPaleoResults = function( id ) {
    var d = $q.defer();
    var url = "http://localhost:8081/playground/paleo-results/";
    $http.get( url ).success( function( data, status, headers, config ) {
      if( data ){
        d.resolve( data );
      }
    })
    .error( function( err, code ) {
        d.reject( err );
        $log.error( err);
    });
    return d.promise;
  };

  service.insertUser = function( userObj ) {
    var d = $q.defer();
    var url = "http://localhost:8081/createUser";
    $http.post( url, userObj ).success( function( data, status, headers, config ) {
      if( data ){
        d.resolve( data );
      }
    })
    .error( function( err, code ) {
      d.reject( err );
      $log.error( err );
    });
    return d.promise;
  };


  return service;

});