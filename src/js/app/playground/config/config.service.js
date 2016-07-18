/**
 * Created by matthew.sanders on 4/15/15.
 */
var app = angular.module('playGroundApp');

app.service('config', function() {
  this.couch = {
    urlLocal: 'http://162.243.61.78:8081/',
    url: "http://localhost:8081/"
  };
});