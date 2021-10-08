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



module.exports = { generateRandomString, getUserByEmail }