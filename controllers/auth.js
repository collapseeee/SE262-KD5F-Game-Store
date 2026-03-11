const encrypt = require('bcryptjs');
const Account = require('../models/account');

const Auth = {
    signup: async (username, password, role) => {
        try {
            const hashedPassword = await encrypt.hash(password, 10);
            const userData = { username, password: hashedPassword, isBuyer: role === 'buyer' ? 1 : 0, isSeller: role === 'seller' ? 1 : 0 };
            await Account.createUser(userData);
        } catch (error) {
            error.message = 'Error creating user: ' + error.message;
            throw error;
        }
    },
    loginBuyer: async (username, password) => {
        try {
            const user = await Account.getUserByName(username);
            if (user === undefined) {
                throw new Error('User not found');
            }
            const isPasswordValid = await encrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            return user;
        } catch (error) {
            error.message = 'Error logging in buyer: ' + error.message;
            throw error;
        }
    },
    loginSeller: async (username, password) => {
        try {
            const user = await Account.getUserByName(username);
            if (user === undefined) {
                throw new Error('User not found');
            }
            const isPasswordValid = await encrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            return user;
        } catch (error) {
            error.message = 'Error logging in seller: ' + error.message;
            throw error;
        }
    }
};

module.exports = Auth;