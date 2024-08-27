// response-utils.js
module.exports.buildResponse = (statusCode, body) => {
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': 'http://create-league.s3-website-us-east-1.amazonaws.com',
        'Access-Control-Allow-Headers': 'Content-Type, x-rapidapi-key',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT'
      },
      body: JSON.stringify(body),
    };
  };
  