const utils = require('../utils/utils');
const bcrypt = require('bcryptjs');

const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-2'
})
const dynamodb= new AWS.DynamoDB.DocumentClient();
const userTable = 'users';

//register user
module.exports.register = async (userInfo) => {
    const name = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;

    console.log('Registration started...');
    console.log('name :',name);
    console.log('email :',email);
    console.log('username :',username);
    console.log('password :',password);

    if(!name|| !email || !username || !password){
        console.error('All fields are required!');
        return utils.buildResponse(400,{ message: 'All fields are required!'});
    }

    const dynamoUser = await getUser(username);

    console.log('Excisting User got from the DB. :',dynamoUser);

    if (dynamoUser && dynamoUser.username){
        return utils.buildResponse(401,{
            message: 'Username already exists in our database!'
        });
    }

    const encryptedpw= bcrypt.hashSync(password.trim(),10);

    const user = {
        name:name,
        email:email,
        username:username.toLowerCase().trim(),
        password:encryptedpw
    };

    console.log('User is ready to go to the DB :', user);

    const saveUserResponse = await saveUser(user);

    if (!saveUserResponse) {
        console.error('Server Error. Please try again later.');
        return utils.buildResponse(200, {message:'Server Error. Please try again later.'});
    }

    return utils.buildResponse(200, {username:username});
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

async function saveUser(user){
    const params = {
        TableName: userTable,
        Item: user
    }

    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error => {
        console.error('There is an error saving user: ', error);
    })
}