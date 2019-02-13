const got = require('got');
var moment = require('moment');
const GoogleHome = require('google-home-push');
const googleIP = process.env.GOOGLE_IP || '10.0.1.1'
const myHome = new GoogleHome(googleIP);

module.exports = {
  getNextGame: function () {
    const today = moment(new Date());
    const url = `https://statsapi.web.nhl.com/api/v1/schedule?startDate=${today.format('YYYY-MM-DD')}&endDate=${today.add(14, 'days').format('YYYY-MM-DD')}&teamId=10`; 

    var nextGameSentence = got(url, { json: true }).then(response => {
        nextGame = response.body.dates[0];
        if(nextGame) {
            console.log(nextGame.date);
            var day = moment(nextGame.date);
            myHome.speak(`The next Maple Leafs hockey game is on ${day.format('dddd')}`);
        }
      }).catch(error => {
        console.log(error.response.body);
    });
  },

  getNextRaptorGame: function () {
    const today = moment(new Date());
    const year = moment(new Date());
    if(year.isBefore(`${year.format('YYYY')}-07-01`)) {
      year.subtract(1, 'years');
    }
    const url = `https://data.nba.net/prod/v1/${year.format('YYYY')}/teams/raptors/schedule.json`;
console.log(url);
    got(url, { json: true }).then(response => {
      schedule = response.body.league.standard;
      var gameDate;
      for(i=0; i<schedule.length; i++) {
        gameDate = moment(schedule[i].startDateEastern);
        console.log(gameDate.diff(today));
        if(gameDate.diff(today.startOf('day')) === 0) {
          gameTime = moment(schedule[i].startTimeUTC);
console.log(gameTime);
          myHome.speak(`The next Raptors basketball game is today at ${gameTime.format('H:mma')}`);
          break;
        } else if(gameDate.diff(today.startOf('day')) > 0) {
          myHome.speak(`The next Raptors basketball game is on ${gameDate.format('dddd')}`);
          break;
        }
      }
    }).catch(error => {
        console.log(error.response.body);
    });
  }

}
