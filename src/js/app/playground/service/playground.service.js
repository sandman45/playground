/**
 * Created by matthew.sanders on 2/19/15.
 */
var app = angular.module('playGroundApp');

app.factory('service', function( $http, $q, $location, $log, config ) {
 var service = {};
  var url = config.api.url;
  service.login = function( data ){
    var d = $q.defer();
    var _url = url + "login";
    $log.info(JSON.stringify($http.defaults.headers));
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
      } else {
          $log.info(`No Results for id = ${id}`);
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

  service.getRecipes = function( id ) {
    var d = $q.defer();
    var _url = url + "playground/recipe/getRecipe/" + id;
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

  service.insertRecipe = function( recipeObj ) {
    var d = $q.defer();
    var _url = url + "playground/recipe/insertRecipe";
    $http.post( _url, recipeObj ).success( function( data, status, headers, config ) {
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
