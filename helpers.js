const generateRandomString = function () {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
};

// const getUserByEmail = function (email) {
//   for (const userID in users) {
//     const user = users[userID];
//     if (user.email === email) {
//       return user;
//     }
//   }
//   return null;
// };
// const generateRandomString = function () {
//   return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
// };

// const getUserByEmail = function (email) {
//   for (const userID in users) {
//     const user = users[userID];
//     if (user.email === email) {
//       return user;
//     }
//   }
//   return null;
// };

// // //REFACTOR
// const getUserByEmail = function (email, database) {
//   const userObj = {};
//   for (const user in database) {
//     if (database[user]['email'] === email) {
//       userObj = database[user]
//       return userObj;
//     }
//   }
//   return null;
// };

// //REFACTOR
const getUserByEmail = function (email, database) {
  for (const user in database) {
    if (database[user]['email'] === email) {
      return database[user];
    }
  }
  return undefined;
};



module.exports = { generateRandomString, getUserByEmail }