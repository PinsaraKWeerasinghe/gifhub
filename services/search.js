const utils = require('../utils/utils');

const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-2'
})
const dynamodb= new AWS.DynamoDB.DocumentClient();
const fileTable = 'files';

module.exports.searchFile = async (fetchBody) => {

    const userName= fetchBody.username;
    const filesList = await getFiles(userName);

    console.log('Files: ',filesList);

    return utils.buildResponse(200, filesList);
}

async function getFiles(username){
    const params = {
        FilterExpression: 'username = :username',
        TableName: fileTable,
        ExpressionAttributeValues: {
            ':username': username
        }
    }

    return await dynamodb.scan(params).promise().then(response => {
        console.log('Response: ',response);
        return response.Items;
    }, error => {
        console.error('There is an error: ', error);
    })
}