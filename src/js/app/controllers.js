/**
 * Created by matthew.sanders on 1/31/14.
 */
var controllers = angular.module('controllers', []);



controllers.controller('mainCtrl', ['$scope',//$http,$routParams
    function($scope) {
        $scope.title = '';
    }]);