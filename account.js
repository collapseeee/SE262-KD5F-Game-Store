import connection from './db.js';

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
    const sql = 'SELECT * FROM users WHERE id = ?';
    try {
      const results = await executeQuery(sql, [userId]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    try {
      const results = await executeQuery(sql, [userData.username, userData.email, userData.password]);
      return results;
    } catch (error) {
      throw error;
    }
  }
};

export default Account;