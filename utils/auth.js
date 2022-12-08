const jwt = require('jsonwebtoken');
const secret = 'dsfg145dfnjafsdf45'

module.exports.generateToken = (user) => {
    if (!user) {
        return null;
    }

    return jwt.sign(user, secret, {
        expiresIn: '1h'
    })
};

module.exports.validateToken = (username, token) => {

    return jwt.verify(token, secret, (error, response) => {
        if (error) {
            return {
                verified: false,
                message: 'invalid token'
            }
        }

        if (response.username !== username) {
            return {
                verified: false,
                message: 'Invalid user'
            }
        }

        return {
            verified: true,
            message: 'verified!'
        }
    });
};