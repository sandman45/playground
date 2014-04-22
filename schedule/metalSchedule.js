/**
 * Created by matthew.sanders on 4/22/14.
 */
var rule;



function init(app,schedule){
  console.log('start metal schedule');
  rule = new schedule.RecurrenceRule();
  rule.hour = 24;
  rule.minute = 0;
  var sched = schedule.scheduleJob(rule,function(){
    execute();
  });
}


function execute(){
  console.log('Executing Scheduled Recurrence Job');

}



module.exports = function(app,schedule) {
  init(app,schedule);
}