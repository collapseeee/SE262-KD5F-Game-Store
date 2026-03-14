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
      return results[0];
    } catch (error) {
      error.message = 'Error creating user: ' + error.message;
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    const sql = 'INSERT INTO accounts (username, password, created_date, isBuyer, isSeller) VALUES (?, ?, ?, ?, ?)';
    const date = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`
    try {
      const results = await executeQuery(sql, [userData.username, userData.password, date, userData.isBuyer, userData.isSeller]);
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
      return results[0];
    } catch (error) {
      error.message = 'Error creating user: ' + error.message;
      throw error;
    }
  }
};

module.exports = Account;
