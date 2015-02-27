/**
 * Created by matthew.sanders on 1/31/14.
 */
var playGroundApp = angular.module('playGroundApp', [
  'ui.bootstrap',
  'ngRoute',
  'controllers',
  'colorpicker.module',
  'nvd3'
]);

playGroundApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/index', {
        templateUrl: 'js/app/playground/main/main.html',
        controller: 'mainCtrl'
        //secure:false
      })
      .when('/login', {
        templateUrl: 'js/app/playground/login/login.html',
        controller: 'loginCtrl'
        //secure:true
      })
      .when('/playground/dotdot', {
        templateUrl: 'js/app/playground/dotdot/dotDot.html',
        controller: 'dotDotCtrl'
        //secure:true
      })
      .when('/playground/paleo', {
        templateUrl: 'js/app/playground/paleo/paleo-main.html',
        controller: 'paleoCtrl'
        //secure:true
      })
      .when('/about', {
        templateUrl: 'views/about.html'
        //secure:false
      })
      .when('/contact', {
        templateUrl: 'views/contact.html'
        //secure:false
      })
      .otherwise({
        redirectTo: '/index'
      });
    }]);
