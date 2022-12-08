module.exports.buildResponse = (statusCode, body) => {
    console.log('Body : ',body);
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
  };