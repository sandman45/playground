/**
 * Created by matthew.sanders on 2/19/15.
 */

const CouchService = require('../routeUtil/couchService');
const couchService = new CouchService('paleo_results');
const _ = require('underscore');
module.exports = function(app){
  /**
   * paleo-results
   */
  app.get('/playground/paleo-results/:id', function( req, res, next ) {
    couchService.get().then( function ( d ) {
      const data = [];
      d.forEach( function (doc) {
        if( _.has( doc.doc, 'userid' ) ) {
          if( req.session.userid === doc.doc.userid ) {
            data.push( doc.doc );
          }
        }
      });
      res.status( 200 ).send( data );
    })
    .fail( function( err ) {
      res.status( err.statusCode ).send( err );
    });
  });
  /**
   * createPaleoResult
   * this will create a new document in couch.
   * if the id is already in couch it will update it
   */
  app.post( '/playground/createPaleoResult', function( req, res, next ){
    console.log( 'createPaleoResult' );
    const id = null;
    const doc = {
      userid: req.body.userid,
      value: req.body.value,
      datetime: req.body.datetime
    };

    couchService.insert( doc, id, 0 ).then( function( d ){
      res.status( 200 ).send( d );
    })
    .fail(function( err ){
      console.log( err );
      res.status( err.statusCode ).send( err );
    });
  });
};
