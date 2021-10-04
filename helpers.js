const generateRandomString = function () {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
};

// //REFACTOR
const getUserByEmail = function (email, database) {
  for (const user in database) {
    if (database[user]['email'] === email) {
      return database[user];
    }
  }
  return undefined;
};
//
const urlsForUser = function (id, database) {
  let output = {};
  for (const [key, value] of Object.entries(database)) {
    if (id === value.userID) {
      output[key] = value.longURL;
    }
  }
  return output;
};



module.exports = { generateRandomString, getUserByEmail, urlsForUser }