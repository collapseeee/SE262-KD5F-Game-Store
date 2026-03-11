const connection = require('./db');

// Execute SQL command method
const executeQuery = (sql, args) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, args, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
};

// Account methods
const Account = {
  // Get user by ID
  getUserById: async (userId) => {
    const sql = 'SELECT * FROM accounts WHERE user_id = ?';
    try {
      const results = await executeQuery(sql, [userId]);
      return results;
    } catch (error) {
      error.message = 'Error creating user: ' + error.message;
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    const sql = 'INSERT INTO Accounts (username, password, created_date, isBuyer, isSeller) VALUES (?, ?, NOW(), ?, ?)';
    try {
      const results = await executeQuery(sql, [userData.username, userData.password, userData.isBuyer, userData.isSeller]);
      return results;
    } catch (error) {
      error.message = 'Error creating user: ' + error.message;
      throw error;
    }
  },
  getUserByName: async (username) => {
    const sql = 'SELECT * FROM accounts WHERE username = ?';
    try {
      const results = await executeQuery(sql, [username]);
      return results;
    } catch (error) {
      error.message = 'Error creating user: ' + error.message;
      throw error;
    }
  }
};

module.exports = Account;
