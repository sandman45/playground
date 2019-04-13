/**
 * Created by matthew.sanders on 4/15/15.
 */
var app = angular.module('playGroundApp');

app.service('config', function() {
  this.api = {
    url: 'http://playground.mattsanders.org:3000/',
    // url: 'http://localhost:3000/'
  };
});
