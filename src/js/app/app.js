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
    $routeProvider.
      when('/index', {
        templateUrl: 'views/playground/main.html',
        controller: 'mainCtrl'
      })
      .when('/login', {
        templateUrl: 'js/app/playground/login/login.html',
        controller: 'loginCtrl'
      })
      .when('/myCarousel', {
        templateUrl: 'views/playground/main.html',
        controller: 'mainCtrl'
      })
      .when('/playground/world', {
        templateUrl: 'views/playground/world.html',
        controller: 'worldCtrl'
      })
      .when('/playground/d3', {
        templateUrl: 'views/playground/d3.html',
        controller: 'd3Ctrl'
      })
      .when('/playground/metals', {
        templateUrl: 'views/playground/metals.html',
        controller: 'metalsCtrl'
      })
      .when('/playground/dotdot', {
        templateUrl: 'views/playground/dotDot.html',
        controller: 'dotDotCtrl'
      })
      .when('/playground/paleo', {
        templateUrl: 'views/playground/paleo-main.html',
        controller: 'paleoCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html'
      })
      .otherwise({
        redirectTo: '/index'
      });
  }]);
