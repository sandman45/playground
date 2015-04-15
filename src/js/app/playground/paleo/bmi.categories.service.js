/**
 * Created by matthew.sanders on 4/15/15.
 */
var app = angular.module('playGroundApp');

app.factory('bmiCategories', function($log, $q ) {
  var categories = [
    {
      'name':'Very severely underweight', range:'less than 15'
    },
    {
      'name':'Severely underweight', range:'15.0 to 16.0'
    },
    {
      'name':'Underweight', range:'16.0 to 18.5'
    },
    {
      'name':'Normal (healthy weight)', range:'18.5 to 25'
    },
    {
      'name':'Overweight', range:'25 to 30'
    },
    {
      'name':'Obese Class I (Moderately obese)', range:'30 to 35'
    },
    {
      'name':'Obese Class II (Severely obese)', range:'35 to 40'
    },
    {
      'name':'Obese Class III (Very severely obese)', range:'over 40'
    }
  ];

  return categories;
});