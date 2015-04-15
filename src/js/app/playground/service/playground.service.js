/**
 * Created by matthew.sanders on 2/19/15.
 */
var app = angular.module('playGroundApp');

app.factory('service', function( $http, $q, $location, $log, config ) {
 var service = {};
 //var url = "http://107.170.178.211:8081/"
 //var url = "http://localhost:8081/"
  var url = config.couch.url;
  service.login = function( data ){
    var d = $q.defer();
    var _url = url + "login";
    $http.post( _url, data).success( function( data, status, headers, config ) {
      d.resolve(data);
    })
    .error( function( err, code ) {
      d.reject( err );
      $log.error( err);
    });

    return d.promise;
  };

  service.logout = function( data ){
    var d = $q.defer();
    var _url = url + "logout";
    $http.get( _url, data).success( function( data, status, headers, config ) {
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
    var _url = url + "playground/user/" + id;
    $http.get( _url ).success( function( data, status, headers, config ) {
      d.resolve( data );
    })
    .error( function( err, code ) {
      d.reject( err );
      $log.error( err);
    });

    return d.promise;
  };


  service.getPaleoResults = function( id ) {
    var d = $q.defer();
    var _url = url + "playground/paleo-results/" + id;
    $http.get( _url ).success( function( data, status, headers, config ) {
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

  service.insertPaleoData = function( data ) {
    var d = $q.defer();
    var _url = url + "playground/createPaleoResult";
    $http.post( _url, data ).success( function( data, status, headers, config ) {
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

  service.insertUser = function( userObj ) {
    var d = $q.defer();
    var _url = url + "createUser";
    $http.post( _url, userObj ).success( function( data, status, headers, config ) {
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