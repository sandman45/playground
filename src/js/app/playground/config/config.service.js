/**
 * Created by matthew.sanders on 4/15/15.
 */
var app = angular.module('playGroundApp');

app.service('config', function() {
  this.api = {
    // url: 'http://162.243.203.80:8081/',
    url: 'http://localhost:8081/'
  };
});