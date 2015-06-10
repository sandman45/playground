/**
 * Created by matthew.sanders on 6/10/15.
 */
var app = angular.module('playGroundApp');

app.service( 'recipeObject', function(){
  this.recipe = {
    name:"",
    description:"",
    directions:"",
    ingredients:[],
    photo:{},
    prep:0,
    cook:0,
    servings:0,
    reviews:[]
  };

  this.ingredient = {
    name:""
  };

  this.review = {
    id:"",
    name:"",
    score:0,
    review:""
  };
});