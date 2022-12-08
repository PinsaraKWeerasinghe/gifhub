const parseMultipart = require('parse-multipart');
const utils = require('../utils/utils');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2'
})
const s3 = new AWS.S3();
const BUCKET = 'gifs-techtest';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const fileTable = 'files';

module.exports.uploadFile = async (event) => {

    const ts = Date.now();
    const userName = event.queryStringParameters.user

    try {
        const { filename, data } = extractFile(event);
        const uniqueFileName = ts + '_' + filename

        console.log('filename:', uniqueFileName);

        await s3.putObject({ Bucket: BUCKET, Key: userName + '/' + uniqueFileName, ACL: 'public-read', Body: data }).promise();

        const link = `https://${BUCKET}.s3.amazonaws.com/${userName + '/' + uniqueFileName}`
        console.log('link :', link)


        const file = {
            ufilename: uniqueFileName,
            username: userName,
            filename: filename
        };

        const saveFileResponse = await saveFileInDB(file);

        if (!saveFileResponse) {
            console.error('Server Error. Please try again later.');
            return utils.buildResponse(200, { message: 'Server Error. Please try again later.' });
        }


        return utils.buildResponse(200, { link: link })
    } catch (error) {
        console.error(error)
        return utils.buildResponse(401, {
            message: 'Incorrect request body!'
        });
    }
}

function extractFile(event) {
    const boundary = parseMultipart.getBoundary(event.headers['content-type']);
    const parts = parseMultipart.Parse(Buffer.from(event.body, 'base64'), boundary);
    const [{ filename, data }] = parts;

    return {
        filename,
        data
    }
}

async function saveFileInDB(file) {
    const params = {
        TableName: fileTable,
        Item: file
    }

    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error => {
        console.error('There is an error saving user: ', error);
    })
}