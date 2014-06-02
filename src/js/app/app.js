/**
 * Created by matthew.sanders on 1/31/14.
 */
var playGroundApp = angular.module('playGroundApp', [
    'ngRoute',
    'controllers',
    'colorpicker.module'
]);

playGroundApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/index',{
                templateUrl:'views/playground/main.html',
                controller:'mainCtrl'
            })
            .when('/myCarousel',{
                templateUrl:'views/playground/main.html',
                controller:'mainCtrl'
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
            .otherwise({
                redirectTo: '/index'
            });
    }]);
