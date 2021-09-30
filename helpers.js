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

// //REFACTOR
const getUserByEmail = function (email, database) {
  let user = {};
  for (const key in database) {
    if (database[key]['email'] === email) {
      user = database[key].id;
      return user;
    }
  }
  return null;
};



module.exports = { generateRandomString, getUserByEmail }