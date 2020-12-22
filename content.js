const fs = require('fs');
const fileLocation = process.env.fileStore + "/content1.json";
var contentData;

try {
  contentData = JSON.parse(fs.readFileSync(fileLocation));
} catch(e) {
  console.error("Unable to find content file " + fileLocation);
  contentData = { "school": [], "birthdays" : [] };
}

module.exports = {
  getAllData: function getAllData() {
    return contentData;
  },

  getBirthdays: function getBirthdays() {
    return contentData.birthdays;
  },

  getSchoolReminders: function getSchoolRemindesr() {
    return contentData.school;
  },

  reload: function reload() {
    console.log("reloading content.json");
    contentData = JSON.parse(fs.readFileSync(filesLocation));
  }
}