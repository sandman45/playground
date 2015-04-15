/**
 * Created by matthew.sanders on 4/15/15.
 */
var app = angular.module('playGroundApp');

app.service('config', function() {
  this.couch = {
    url: 'http://107.170.178.211:8081/',
    urlLocal: "http://localhost:8081/"
  };
});