var moment       = require('moment');
const content    = require('./content.js');
const talker     = require('./GoogleHomeDevice.js');
const schedule   = require('node-schedule');

module.exports = {

  setSchedule: function() {
  
    schoolNotice = content.getSchoolReminders();
    
    schoolNotice.forEach(function(reminder) {
      console.log("schedule " + reminder.message);
      schedule.scheduleJob(reminder.cron, function() {
        talker.speak(reminder.message);
      });
    });
  }

}