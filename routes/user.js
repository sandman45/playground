/**
 * Created by matthew.sanders on 2/19/15.
 */
var moment = require('moment');
var CouchService = require('../routeUtil/couchService');
var couchService = new CouchService('users');
var crypto = require('crypto-js');

const uuid = require('uuid');

module.exports = function(app){
  app.post('/login', function( req, res, next ){
    console.log(JSON.stringify(req.body));
    console.log(`/login/:id => ${req.body.email}`);
    if(req.body.email && req.body.email.length>0){
      couchService.view('getUserByEmail', 'get-user-by-email', req.body.email).then(function(data){
        console.log(`user data: ${JSON.stringify(data)}`);
        if(data.password === crypto.SHA3(req.body.password).toString()){
          //set session
          if(req.session){
            req.session.userid = data._id;
            req.session.username = data.username;
            req.session.firstname = data.firstname;
            req.session.lastname = data.lastname;
            req.session.email = data.email;
          }
          res.status(200).send('Success');
        }else{
          res.status(401).send({message:'Username or Password incorrect'});
        }
      })
      .fail(function(err){
        console.log(`fail: ${err}`);
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
    console.log(`/logout => ${req.session.email}`);
     req.session = null;
     res.status(200).send('success');
  });

  app.get('/playground/user/:email', function( req, res, next ){
    console.log(`/playground/user/:email => ${req.params.email}`);
    couchService.view('getUserByEmail', 'get-user-by-email', req.params.email === "refresh" ? req.session.email : req.params.email).then( function( d ){
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
    // create UUID for user
    const userId = uuid();
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
      userid: userId,
      username: req.body.username,
      created: moment.utc()
    };

    couchService.insert( doc, userId, 0 ).then( function( d ){
      console.log("user created: " + JSON.stringify(d));
      res.status( 200 ).send( d );
    })
    .fail(function( err ){
        console.log( err );
      res.status( err.statusCode ).send( err );
    });
  });
};
