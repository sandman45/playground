/**
 * Created by matthew.sanders on 4/15/15.
 */
var app = angular.module('playGroundApp');

app.service('config', function() {
  this.api = {
    url: 'http://162.243.61.78:8081/',
    urlLocal: 'http://localhost:8081/'
  };
});