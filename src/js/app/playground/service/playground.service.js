/**
 * Created by matthew.sanders on 2/19/15.
 */
var app = angular.module('playGroundApp');

app.factory('service', function( $http, $q, $location ) {
 var service = {};

  service.getPaleoResults = function( id ){
    var d = $q.defer();
    var url = "http://localhost:8081/paleo-results/";
    $http.get( url ).success( function( data, status, headers, config ){
      if( data ){
        d.resolve( data );
      }
    })
    .error( function( err, code ) {
        d.reject( err );
    });
    return d.promise;
  };

  return service;

});