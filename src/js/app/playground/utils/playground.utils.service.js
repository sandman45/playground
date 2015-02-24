/**
 * Created by matthew.sanders on 2/20/15.
 */
var app = angular.module('playGroundApp');

app.factory('utils', function($log, $q ) {
  var service = {};

  service.getTimestamp = function() {
    return new Date().toISOString();
  };

  service.getGeoLoc = function() {
    var deferred = $q.defer();
    var posOptions = { timeout: 10000, enableHighAccuracy: false };
    //$cordovaGeolocation.getCurrentPosition( posOptions )
    //  .then( function( position ) {
    //    var lat  = position.coords.latitude;
    //    var long = position.coords.longitude;
    //    $log.info( "Found geolocation. Lat: " + lat + " Long: " + long );
    //    deferred.resolve( { lat: lat, long: long } );
    //  }, function(err) {
    //    // error
    //    deferred.reject( "Error getting geolocation: " + err );
    //  });

    return deferred.promise;
  };

  service.generateGUID = function() {
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });

    $log.info( "new guid: " + guid );

    return guid;
  };

  service.calculateDistanceFromTwoGeoCoord = function(lat1, lng1, lat2, lng2){
    var toRadians = function(deg){
      return deg * (Math.PI/180);
    };
    var toMiles = function(meters){
      return meters*0.00062137;
    };
    var R = 6371000; //earths radius in meters
    var phi_1 = toRadians(lat1);
    var phi_2 = toRadians(lat2);
    var lat_diff = (lat2-lat1);
    var phi_diff = toRadians(lat_diff);
    var lng_diff = (lng2-lng1);
    var lambda_diff = toRadians(lng_diff);

    var a = Math.sin(phi_diff/2) * Math.sin(phi_diff/2) + Math.cos(phi_1) * Math.cos(phi_2) * Math.sin(lambda_diff/2) * Math.sin(lambda_diff/2);
    var c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    var d = R * c;
    return toMiles(d).toFixed(2);
  };

  service.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  service.validatePhone = function(phone) {
    if(phone){
      var _phone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if((phone.match(_phone))){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  };

  service.approxRollingAverage = function( data, i ) {
    var avg = (parseFloat(data[i].y) + parseFloat(data[i-1].y) + parseFloat(data[i+1].y))/3;
    return avg;
  };


  return service;
});