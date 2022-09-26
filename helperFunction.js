const getUserByEmail = (email, database) => {
    for (let userId in database) {
      if (database[userId].email.toLowerCase() === email.toLowerCase()) {
        return database[userId];
      }
    }
    return false;
  };

  module.exports = { getUserByEmail};