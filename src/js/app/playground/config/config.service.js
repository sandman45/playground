/**
 * Created by matthew.sanders on 4/15/15.
 */
var app = angular.module('playGroundApp');

app.service('config', function() {
  this.api = {
    url: 'http://playground.mattsanders.org/',
    // url: 'http://localhost:3000/'
  };
});
