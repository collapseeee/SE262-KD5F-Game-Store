const encrypt = require('bcryptjs');
const Account = require('../models/account');

const Auth = {
    signup: async (username, password) => {
        try {
            const hashedPassword = await encrypt.hash(password, 10);
            const userData = { username, password: hashedPassword };
            await Account.createUser(userData);
        } catch (error) {
            throw error;
        }
    },};

module.exports = Auth;