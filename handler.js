'use strict';

const registerService = require('./services/register');
const loginService = require('./services/login');
const validateService = require('./services/validate');
const uploadFileService = require('./services/uploadFile');
const fetchFileService = require('./services/fetchFiles');

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.register = async (event) => {
  console.log('Request Event: ',event)
  let response;
  const registerBody = JSON.parse(event.body);
  response = await registerService.register(registerBody);

  return response;
};

module.exports.login = async (event) => {
  console.log('Request Event: ',event)
  let response;
  const loginBody = JSON.parse(event.body);
  response = await loginService.login(loginBody);
  return response;
};

module.exports.validate = async (event) => {
  console.log('Request Event: ',event)
  let response;
  const validateInfo = JSON.parse(event.body);
  response = validateService.validate(validateInfo);
  return response;
};

module.exports.uploadFile = async (event) => {
  console.log('Request Event: ',event)
  let response;
  // const validateInfo = JSON.parse(event.body);
  response = uploadFileService.uploadFile(event);
  return response;
};

module.exports.fetchFiles = async (event) => {
  console.log('Request Event: ',event)
  let response;
  const fetchBody = JSON.parse(event.body);
  response = await fetchFileService.fetchFiles(fetchBody);
  return response;
};

module.exports.fetchFile = async (event) => {
  console.log('Request Event: ',event)
  let response;
  const fetchBody = JSON.parse(event.body);
  response = await fetchFileService.fetchFile(fetchBody);
  return response;
};
