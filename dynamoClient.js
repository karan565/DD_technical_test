const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

const dynamodb = new AWS.DynamoDB();
const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'DD_technical_test_users';

const waitForTableActive = async (tableName) => {
    console.log(`Waiting for table "${tableName}" to become ACTIVE...`);
    await dynamodb.waitFor('tableExists', { TableName: tableName }).promise();
    console.log(`Table "${tableName}" is now ACTIVE.`);
};

const createTableIfNotExists = async () => {
    try {
        const tables = await dynamodb.listTables().promise();
        if (!tables.TableNames.includes(TABLE_NAME)) {
            console.log(`Creating table: ${TABLE_NAME}...`);
            const params = {
                TableName: TABLE_NAME,
                AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
                KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
                BillingMode: 'PAY_PER_REQUEST',
            };
            await dynamodb.createTable(params).promise();
            await waitForTableActive(TABLE_NAME);
            console.log(`Table "${TABLE_NAME}" created successfully.`);
        } else {
            console.log(`Table "${TABLE_NAME}" already exists.`);
            await waitForTableActive(TABLE_NAME);  // Ensure table is active before operations
        }
    } catch (error) {
        console.error('Error checking/creating table:', error);
    }
};

createTableIfNotExists();

module.exports = { dynamoClient, TABLE_NAME };
