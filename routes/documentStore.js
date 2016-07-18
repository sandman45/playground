
var CouchService = require('../routeUtil/couchService');
var couchService = new CouchService('document_store');
var moment = require('moment');
var _ = require('lodash');
var multer  = require('multer'); //TODO: will need to update the express js and use multer
var upload = multer({ dest: 'uploads/' });
var fs = require('fs');
module.exports = function( app ){

  app.post('/playground/uploadDocument', upload.single('file'), function( req, res, next ){
    var file = req.file;
    var content;
    fs.readFile( file.path, function read( err, data ){
      if( err ){
        console.log( err );
        res.send( 500, err );
      }
      content = (new Buffer(data, 'utf8')).toString('base64');

      var documentData = {
        user_id: req.session.username,
        created_date: moment(),
        challenge_id: req.body.challenge_id,
        _attachments:{}
      };

      documentData._attachments[file.originalname] = {
        content_type: file.mimetype,
        data: content
      };

      couchService.insert( documentData, 0 ).then( function( d ){
        console.log("documents uploaded: " + d);
        cleanUpFile(file.path);
        res.send( 200, d );
      })
      .fail(function( err ){
        console.log( err );
        res.send( err.statusCode, err );
      });
    });
  });

  app.get('/playground/getUserDocuments/:userid', function( req, res, next ){
    var userid = req.params.userid;
    var qs = { key: userid  };
    couchService.getView( 'views','getDocumentsByUserId', qs ).then(function( docs ){
      res.send( 200, docs );
    })
    .catch(function( err ){
      res.send( 500, err );
    });
  });

  app.get('/playground/getChallengeDocuments/:challengeid', function( req, res, next ){
    var challengeid = req.params.challengeid;
    var qs = { key: challengeid  };
    couchService.getView( 'views','getDocumentsByChallengeId', qs ).then(function( docs ){
      res.send( 200, docs );
    })
    .catch(function( err ){
      res.send( 500, err );
    });
  });

  app.get('/playground/getUserChallengeDocuments/:userid/:challengeid', function( req, res, next ){
    var challengeid = req.params.challengeid;
    var userid = req.params.userid;
    var qs = { key:[ userid, challengeid ] };
    couchService.getView( 'views','getUserChallengeDocuments', qs ).then(function( docs ){
      res.send( 200, docs );
    })
      .catch(function( err ){
        res.send( 500, err );
      });
  });

  /**
   * cleanUpFile
   * removes temporary file
   * @param path
   */
  function cleanUpFile( path ){
    fs.unlink( path, function( err ){
      if( err ) throw err;
      console.log('successfully deleted ' + path);
    });
  }

}