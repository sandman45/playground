/**
 * Created by matthew.sanders on 2/19/15.
 */
const fullUrl = `http://${process.env.COUCH_USER}:${process.env.COUCH_SECRET}@${process.env.COUCH_HOST}:${process.env.COUCH_PORT}`;
const nano = require('nano')(fullUrl);
console.log(fullUrl);
const q = require('q');
const _ = require('underscore');

const CouchService = (function(){

  /**
   * CouchService
   * @param databaseName
   * @constructor
   */
  function CouchService(databaseName){
    this.db_name = databaseName;
    this.db = nano.use(this.db_name);
  }

  /**
   * insert
   * @param doc
   * @returns {d.promise}
   */
  CouchService.prototype.insert = function( doc, id, tried ) {
    var d = q.defer();
    if ( doc ){
      var cs = this;
      this.db.insert(doc, id, function ( err, body ) {
        if ( err ) {
          if ( err.error === 'conflict' && tried < 1 ) {
            cs.db.get(id, function(err, body){
              doc._rev = body._rev;
              cs.db.insert( doc, id, function( err, body ) {
                if ( !err ){
                  d.resolve( body )
                } else {
                  console.log( err );
                  d.reject( err );
                }
              });
            });
          }else{
            d.reject(err);
          }
        }
        else {
          d.resolve( body );
        }
      });
    }
    return d.promise;
  };

  /**
   * get
   * @param id
   * @returns {promise|*|promise.promise|jQuery.promise|d.promise|Q.promise}
   */
  CouchService.prototype.get = function (id) {
    var deferred = q.defer();
    if (id) {
      this.db.get(id, this.responsePromise(deferred, 'get'));
    }
    else {
      var data = [];
      var params = {
        include_docs:true,
        descending:true
      };
      this.db.list(params ,function(err, body){
        if(!err){
          body.rows.forEach(function(doc){
            data.push(doc);
          });
          deferred.resolve(data);
        }
      });
    }
    return deferred.promise;
  };

  /**
   * view
   * @param designName
   * @param viewName
   * @param key
   * @returns {promise|*|promise.promise|jQuery.promise|d.promise|Q.promise}
   */
  CouchService.prototype.view = function (designName, viewName, key) {
    var deferred = q.defer();
    const keyParams = {
      key: key,
      include_docs: true,
    };
    if (key) {
      this.db.view(designName, viewName, keyParams, this.responsePromise(deferred, 'view'));
    }
    return deferred.promise;
  };

  /**
   * remove
   * @param doc
   * @param destroy
   */
  CouchService.prototype.remove = function (doc, destroy) {
    var d = q.defer();
    if (doc) {
      if (!destroy) {
        doc.deleted = true;
        this.update(doc)
          .then(function(result){
            d.resolve(result);
          })
          .catch(function(err){
            d.reject(err);
          });
      }
      else {
        this.db.destroy(null, doc.id, function (error, body) {
          if (!error) {
            console.log(JSON.stringify(body));
          }
        });
      }
    }
  };

  /**
   * responsePromise
   * @param deferred
   * @param functionName
   * @returns {Function}
   */
  CouchService.prototype.responsePromise = function (deferred, functionName) {
    return function (error, body) {
      if (error) {
        console.error(functionName + ' ERROR: ' + error);
        deferred.reject(error);
      }
      else {
        if (_.isArray(body)) {
          //log.info(DEBUG + ' records: ' + body.length);
          deferred.resolve(body.rows);
        }
        else if (_.isObject(body)) {
          if (body.rows) {
            if (body.rows.length > 0) {
              if (body.rows.length == 1) {
                deferred.resolve(body.rows[0].value);
              }
              else {
                deferred.resolve(body.rows);
              }
            }
            else {
              deferred.resolve({});
            }
          }
          else {
            deferred.resolve(body);
          }
        }
        else {
          deferred.resolve(body);
        }
      }
    };
  };
  return CouchService;
})();

module.exports = CouchService;
