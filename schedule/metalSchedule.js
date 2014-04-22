/**
 * Created by matthew.sanders on 4/22/14.
 */
var rule;
var request = require('request');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

function init(app,schedule){
  console.log('start metal schedule');
  rule = new schedule.RecurrenceRule();
  rule.hour = 12;
  rule.minute = 0;

  var sched = schedule.scheduleJob(rule,function(){
    execute();
  });
}


function execute(){
  console.log('Executing Scheduled Recurrence Job');
  var options = {
    host:'http://www.xmlcharts.com',
    path:'/cache/precious-metals.php'
  };

 request.get('http://www.xmlcharts.com/cache/precious-metals.php',function(err,res,body){
    if(!err){
      var xml = body;
      parser.parseString(xml);
      var data = parser.resultObject.prices.currency;
      console.log(JSON.stringify(data));
    }
 });
}



module.exports = function(app,schedule) {
  init(app,schedule);
}