const utils = require('../utils/utils');

const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-2'
})
const dynamodb= new AWS.DynamoDB.DocumentClient();
const fileTable = 'files';

const s3 = new AWS.S3();
const BUCKET = 'gifs-techtest';

module.exports.fetchFiles = async (fetchBody) => {

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

module.exports.fetchFile = async (fetchBody) => {
    return await getFile(fetchBody); 
}

async function getFile(fetchBody) {

    const userName = fetchBody.username;
    const ufilename = fetchBody.ufilename;

    const s3file = await s3.getObject({ Bucket: BUCKET, Key: userName + '/' + ufilename }).promise();
    const fileContent = s3file.Body.toString('base64');

    return fileContent;
}