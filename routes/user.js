/**
 * Created by matthew.sanders on 2/19/15.
 */
var moment = require('moment');
var CouchService = require('../routeUtil/couchService');
var couchService = new CouchService('users');
var crypto = require('crypto-js');

module.exports = function(app){
  app.post('/login', function( req, res, next ){
    if(req.body.email && req.body.email.length>0){
      couchService.get(req.body.email).then(function(data){
        console.log(data);
        if(data.password === crypto.SHA3(req.body.password).toString()){
          //set session
          req.session.username = req.body.email;
          req.session.firstname = data.firstname;
          req.session.lastname = data.lastname;
          req.session.email = data.email;
          res.status(200).send('Success');
        }else{
          res.status(401).send({message:'Username or Password incorrect'});
        }
      })
      .fail(function(err){
        console.log(err);
          if(err.message === 'missing'){
            res.status(err.statusCode).send({message:'Username or Password incorrect'});
          }else{
            res.status(err.statusCode).send({message:err.message});
          }
      });
    }else{
      res.status(402).send({message:'Username or Password incorrect'});
    }
  });

  app.get('/logout', function( req, res, next ){
     req.session.destroy();
     res.status(200).send('success');
  });

  app.get('/playground/user/:id', function( req, res, next ){
      couchService.get( req.params.id === "refresh" ? req.session.email : req.params.id ).then( function( d ){
        res.status( 200 ).send(d);
      })
      .fail(function( err ){
        res.status( err.statusCode ).send( err );
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
      password: crypto.SHA3(req.body.password).toString(),
      phone: req.body.phone,
      postal: req.body.postal,
      state: req.body.state,
      userid: req.body.userid,
      username: req.body.username,
      created: moment.utc()
    };

    couchService.insert( doc, req.body.email, 0 ).then( function( d ){
      console.log("user created: " + d);
      res.status( 200 ).send( d );
    })
    .fail(function( err ){
        console.log( err );
      res.status( err.statusCode ).send( err );
    });
  });
};