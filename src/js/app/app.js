/**
 * Created by matthew.sanders on 1/31/14.
 */
var playGroundApp = angular.module('playGroundApp', [
    'ngRoute',
    'controllers'
]);

playGroundApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/index',{
                templateUrl:'views/playground/main.html',
                controller:'mainCtrl'
            }).
            when('/myCarousel',{
                templateUrl:'views/playground/main.html',
                controller:'mainCtrl'
            }).
            when('/playground/world', {
                templateUrl: 'views/playground/world.html',
                controller: 'worldCtrl'
            }).
            when('/playground/d3', {
                templateUrl: 'views/playground/d3.html',
                controller: 'd3Ctrl'
            })
            .
            otherwise({
                redirectTo: '/index'
            });
    }]);