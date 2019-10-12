var moment = require('moment');
const GoogleHome = require('google-home-push');
const googleIP = process.env.GOOGLE_IP || '10.0.1.1'
const myHome = new GoogleHome(googleIP);

// fyi - won't handle early days of January less than the substract
const birthdays = [ cP('Kevin', '1973-04-04'), cP('Erin', '1979-09-17'), cP('George', '2015-10-25'), cP('Rosheen', '2013-01-23'), cP('Ian', '2014-05-09'), cP('Evelyn', '2018-03-11') ];

var upcomingEvent = [];

module.exports = {

  nextBirthday: function() {
    const notifyWithin = 15;
    birthdays.forEach(function(person) {
      var when = person.birthday.year(moment().year());
      var days = when.diff(moment().startOf('day'), 'days');
      if(days > 0 && days < notifyWithin) {
        console.log(person.name + " has a birthday in " + days + " days");
        myHome.speak(person.name + " has a birthday in " + days + " days");
      } else if(days < 0 && (days + 365) < notifyWithin) {
        console.log(person.name + " has a birthday in " + (days + 365) + " days");
      } else if(days == 0) {
        console.log("It's " + person.name + "'s birthday today");
      }

    });
  } 

}
  //createPerson
  function cP(name, birthday) {
    const p = {};
    p.name = name;
    p.birthday = moment(birthday);

    return p;
  }

