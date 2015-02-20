/**
 * Created by matthew.sanders on 2/19/15.
 */

var CouchService = require('../routeUtil/couchService');
var couchService = new CouchService('users');

module.exports = function(app){
  app.post('/login', function(req,res,next){

  });

  app.get('/logout', function(req,res,next){

  });

  app.get('/user/:id', function(req,res,next){
    couchService.get(req.params.id).then(function(d){
      res.send(200, d);
    })
    .fail(function(err){
      res.send(err.statusCode, err);
    });
  });
  /**
   * createUser
   * this will create a new document in couch.
   * if the id is already in couch it will update it
   */
  app.post( '/createUser', function( req, res, next ){
    console.log( 'createUser' );
    var doc = {
      address_1: req.body.address_1,
      address_2: req.body.address_2,
      city: req.body.city,
      country: req.body.country,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
      phone: req.body.phone,
      postal: req.body.postal,
      state: req.body.state,
      userid: req.body.userid,
      username: req.body.username
    };
    //TODO: have the id be the username? or email?
    couchService.insert( doc, req.body.username, 0 ).then( function( d ){
      res.send( 200, d );
    })
    .fail(function( err ){
        console.log( err );
      res.send( err.statusCode, err );
    });
  });
}