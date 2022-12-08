const utils = require('../utils/utils');
const auth = require('../utils/auth');
const bcrypt = require('bcryptjs');

const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-2'
})
const dynamodb= new AWS.DynamoDB.DocumentClient();
const userTable = 'users';

//login user
module.exports.login = async (loginInfo) => {
    
    const username = loginInfo.username;
    const password = loginInfo.password;

    console.log('Login started...');
    console.log('User :',loginInfo);


    if(!username || !password){
        console.error('All fields are required!');
        return utils.buildResponse(400,{ message: 'All fields are required!'});
    }

    const dynamoUser = await getUser(username);

    console.log('Excisting User got from the DB. :',dynamoUser);

    if (!dynamoUser || !dynamoUser.username){
        return utils.buildResponse(403,{
            message: 'Username does not exist!'
        });
    }

    if(!bcrypt.compareSync(password,dynamoUser.password)){
        return utils.buildResponse(403,{message: 'Password is incorrect!'})
    }

    const userInfo = {
        username: dynamoUser.username,
        name: dynamoUser.name
    }
    const token=auth.generateToken(userInfo);
    const response={
        user: userInfo,
        token: token
    }

    return utils.buildResponse(200, response);
};

async function getUser(username){
    const params = {
        TableName: userTable,
        Key: {
            username:username
        }
    }

    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('There is an error: ', error);
    })
}

