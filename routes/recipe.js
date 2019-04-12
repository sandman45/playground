/**
 * Created by matthew.sanders on 6/8/15.
 */

var CouchService = require('../routeUtil/couchService');
var couchService = new CouchService('recipes');
var _ = require('lodash');

module.exports = function(app){
  /**
   * recipe
   */
  app.get('/playground/recipe/getRecipe/:id', function( req, res, next ) {
    couchService.get().then( function ( d ) {
      var data = [];
      d.forEach( function (doc) {
        if( _.has( doc.doc, "userid" ) ) {
          if( req.session.username === doc.doc.userid ) {
            data.push( doc.doc );
          }
        }
      });
      res.status(200).send( data );
    })
      .fail( function( err ) {
        res.status(err.statusCode).send( err );
      });
  });
  /**
   * insertRecipe
   * this will create a new document in couch.
   * if the id is already in couch it will update it
   */
  app.post( '/playground/recipe/insertRecipe', function( req, res, next ){
    console.log( 'insert recipe' );
    var id = null;
    var doc = {
      userid: req.session.username,
      value: req.body.value,
      datetime: req.body.datetime
    };

    couchService.insert( doc, id, 0 ).then( function( d ){
      res.status(200).send( d );
    })
      .fail(function( err ){
        console.log( err );
        res.status(err.statusCode).send( err );
      });
  });
};
