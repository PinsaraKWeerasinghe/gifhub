const auth = require('../utils/auth')
const utils = require('../utils/utils')

module.exports.validate = (validateInfo) => {
    if (!validateInfo.user || !validateInfo.user.username || !validateInfo.token) {

        console.log('Information missing!:', validateInfo);

        return utils.buildResponse(401, {
            verified: false,
            message: 'Incorrect request body!'
        });
    }

    const user = validateInfo.user;
    const token = validateInfo.token;
    const verfication = auth.validateToken(user.username,token);

    if(!verfication.verified){
        return utils.buildResponse(401, {
            verified: false,
            message: verfication
        }
        )
    }

    return utils.buildResponse(200,{
        verified: true,
        message: 'success',
        user: user,
        token: token
    })
};