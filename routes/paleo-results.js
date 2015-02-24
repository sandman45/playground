/**
 * Created by matthew.sanders on 2/19/15.
 */

var CouchService = require('../routeUtil/couchService');
var couchService = new CouchService('paleo_results');
var _ = require('underscore');
module.exports = function(app){
  /**
   * paleo-results
   */
  app.get('/playground/paleo-results/:id', function( req, res, next ) {
    couchService.get().then( function ( d ) {
      var data = [];
      d.forEach( function (doc) {
        if( _.has( doc.doc, "userid" ) ) {
          if( req.params.id === doc.doc.userid ) {
            data.push( doc.doc );
          }
        }
      });
      res.send( 200, data );
    })
    .fail( function( err ) {
      res.send( err.statusCode, err );
    });
  });
  /**
   * createPaleoResult
   * this will create a new document in couch.
   * if the id is already in couch it will update it
   */
  app.post( '/playground/createPaleoResult', function( req, res, next ){
    console.log( 'createPaleoResult' );
    var id = null;
    if(req.body.id){
      id = req.body.id;
    }
    var doc = {
      userid: req.body.userid,
      value: req.body.value,
      datetime: req.body.datetime
    };

    couchService.insert( doc, id, 0 ).then( function( d ){
      res.send( 200, d );
    })
    .fail(function( err ){
        console.log( err );
      res.send( err.statusCode, err );
    });
  });
}