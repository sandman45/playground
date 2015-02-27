/**
 * Created by matthew.sanders on 6/17/14.
 */


module.exports = function(app,socket) {
  app.post('/testNews', function(req,res){

    res.send(200,'hi');
  });
  app.get('/alive',function(req,res,next){
    res.send(200,{status:'Alive!'});
  });
}