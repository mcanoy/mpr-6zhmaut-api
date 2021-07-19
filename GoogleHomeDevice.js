const GoogleHome = require('google-home-push');
const got = require('got');
var FormData = require('form-data');
var fs = require('fs');
const googleIP = process.env.GOOGLE_IP || '10.0.1.1'
const myHome = new GoogleHome(googleIP);

const voices = [ "en-IN", "en-GB", "en-US", "en-AU" ];

module.exports = {
  speak: function (text) {
    accent = Math.floor(Math.random() * voices.length);
    console.log("testing " + text + " " + accent);

    myHome.speak(text, voices[accent]);
  },

  speakWithAccent: function (text, accent) {
    console.log("testing " + text + " " + accent);

    myHome.speak(text, accent);
  },

  translate: function (words, language) {
    var form = new FormData();
    form.append('text', words);

    const url="https://api.funtranslations.com/translate/" + language + ".json";
    (async () => {
      const {body} = await got.post(url, {
        body: form,
        responseType: 'json'
    });

//    console.log(body);
    let response = JSON.parse(body);
    myHome.speak(response.contents.translated);
})();
  },

}
