/**
 * Created by matthew.sanders on 1/31/14.
 */
var controllers = angular.module('controllers', []);

controllers.controller('worldCtrl', ['$scope',//$http,$routParams
    function ($scope, $http) {
        $scope.title = 'WORLD!!!!!!';
    }]);

controllers.controller('d3Ctrl', ['$scope',//$http,$routParams
    function($scope) {
        $scope.title = 'D3!!!!!!!!!!!';
    }]);