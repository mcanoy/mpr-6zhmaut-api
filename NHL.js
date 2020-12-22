const fs            = require('fs');
const filesLocation = process.env.fileStore + "/teams.json";
const teams         = JSON.parse(fs.readFileSync(filesLocation, 'utf8')).league.standard;
const got           = require('got');
var moment          = require('moment');
const talker        = require('./GoogleHomeDevice.js');

module.exports = {

  getNextLeafGame: function () {
    const today = moment(new Date());
    const twoWeeks = moment(new Date()).add(14, 'days');
    const url = `https://statsapi.web.nhl.com/api/v1/schedule?startDate=${today.format('YYYY-MM-DD')}&endDate=${twoWeeks.format('YYYY-MM-DD')}&teamId=10`;

    var nextGameSentence = got(url, { json: true }).then(response => {
        nextGame = response.body.dates[0];
        if(nextGame) {
            var day = moment(nextGame.date);

            if(day.diff(today.startOf('day'), 'days') == 0) {
              var gameTime = moment(nextGame.games[0].gameDate);
              var team = nextGame.games[0].teams.away.team.name;
              if(team == 'Toronto Maple Leafs') {
                team = nextGame.games[0].teams.home.team.name;
              }
              var text = `The next Leafs game is today at ${gameTime.format('H:mma')} against the ${team}`
              console.log(text);
              talker.speak(text);
            } else {
              console.log(`The next Leafs game is on ${day.format('dddd')}`);
              talker.speak(`The next Leafs game is on ${day.format('dddd')}`);
            }
        }
      }).catch(error => {
        console.log(error.response.body);
    });
  },

  getNextRaptorGame: function () {
    const raptorId = "1610612761";
    const today = moment(new Date());
    const year = moment(new Date());
    if(year.isBefore(`${year.format('YYYY')}-07-01`)) {
      year.subtract(1, 'years');
    }
    const url = `https://data.nba.net/prod/v1/${year.format('YYYY')}/teams/raptors/schedule.json`;

    got(url, { json: true }).then(response => {
      schedule = response.body.league.standard;
      var gameDate;
      for(i=0; i<schedule.length; i++) {
        gameDate = moment(schedule[i].startDateEastern);
        if(gameDate.diff(today.startOf('day')) === 0) {
          gameTime = moment(schedule[i].startTimeUTC);
          const competitor = (raptorId === schedule[i].vTeam.teamId) ? schedule[i].hTeam.teamId : schedule[i].vTeam.teamId;
          var competitorName = "";
          for(i=0; i< teams.length; i++) {
            if(teams[i].teamId === competitor) {
              competitorName = teams[i].city;
              break;
            }
          }

          const nextGame = `The next Raptors game is today at ${gameTime.format('H:mma')} against ${competitorName}`;
          
          console.log(nextGame);
          talker.speak(nextGame);
          break;
        } else if(gameDate.diff(today.startOf('day'), 'days')  > 7) {
          console.log('The next Raptors game is in ' + gameDate.diff(today.startOf('day'), 'days') + ' days');
          talker.speak('The next Raptors game is in ' + gameDate.diff(today.startOf('day'), 'days') + ' days');
          break;
        } else if(gameDate.diff(today.startOf('day')) > 0) {
          console.log(`The next Raptors game is on ${gameDate.format('dddd')}`);
          talker.speak(`The next Raptors game is on ${gameDate.format('dddd')}`);
          break;
        }
      }
    }).catch(error => {
        console.log(error.response.body);
    });
  }

}
