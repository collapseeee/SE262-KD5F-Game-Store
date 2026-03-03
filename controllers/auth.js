const encrypt = require('bcryptjs');
const Account = require('../models/account');

const Auth = {
    signup: async (username, password, role) => {
        try {
            const hashedPassword = await encrypt.hash(password, 10);
            const userData = { username, password: hashedPassword, isBuyer: role === 'buyer' ? 1 : 0, isSeller: role === 'seller' ? 1 : 0 };
            await Account.createUser(userData);
        } catch (error) {
            throw error;
        }
    },
    loginBuyer: async (username, password, role) => {
        try {
            const users = await Account.getUserByName(username);
            if (users.length === 0) {
                throw new Error("User not found");
            }
            const user = users[0];
            const isPasswordValid = await encrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }
            if (user.isBuyer !== 1) {
                throw new Error("User is not a buyer");
            }
            return user;
        } catch (error) {
            throw error;
        }
    },
    loginSeller: async (username, password, role) => {
        try {
            const users = await Account.getUserByName(username);
            if (users.length === 0) {
                throw new Error("User not found");
            }
            const user = users[0];
            const isPasswordValid = await encrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }
            if (user.isSeller !== 1) {
                throw new Error("User is not a seller");
            }
            return user;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Auth;