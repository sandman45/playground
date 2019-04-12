/**
 * Created by matthew.sanders on 4/15/15.
 */
var app = angular.module('playGroundApp');

app.service('config', function() {
  this.api = {
     // url: 'http://ec2-52-13-28-255.us-west-2.compute.amazonaws.com:3000/',
    url: 'http://localhost:3000/'
  };
});
