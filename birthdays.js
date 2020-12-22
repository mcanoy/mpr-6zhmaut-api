var moment       = require('moment');
const content    = require('./content.js');
const talker     = require('./GoogleHomeDevice.js');

module.exports = {

  nextBirthday: function() {
    var nextBirthdayMessage = "";

    bdays = content.getBirthdays();
    //console.log(bdays);
    bdays.forEach(function(birthday) {
      var nextBirthday = moment(birthday.date);
      nextBirthday.year(moment().year());

      daysDiff = nextBirthday.diff(moment(), 'days');
      if(daysDiff < 0) { //this year's birthday has passed. Check next year
        nextBirthday.year(nextBirthday.year()+1);
        daysDiff  = nextBirthday.diff(moment(), 'days');
      }

      // console.log(birthday);
      // console.log(daysDiff);

      if(daysDiff == 0) {
        nextBirthdayMessage = "It's " + birthday.person + "'s birthday today"
        talker.speak(nextBirthdayMessage);
      } else if(daysDiff < birthday.notifyDays) {
        nextBirthdayMessage = birthday.person + " has a birthday in " + daysDiff + " days";
        console.log(nextBirthdayMessage);
        talker.speak(nextBirthdayMessage);
      }

    });

    return nextBirthdayMessage;

  }

}

