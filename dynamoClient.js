const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' }); // change region if needed

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Users';

module.exports = { dynamoClient, TABLE_NAME };
