const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dynamoClient, TABLE_NAME } = require('../dynamoClient');
const validateUser = require('../middlewares/validateUser');

const router = express.Router();

// Create User
router.post('/',validateUser, async (req, res) => {
  const user = { id: uuidv4(), ...req.body };
  await dynamoClient.put({ TableName: TABLE_NAME, Item: user }).promise();
  res.json(user);
});

// Get All Users
router.get('/', async (req, res) => {
  const data = await dynamoClient.scan({ TableName: TABLE_NAME }).promise();
  res.json(data.Items);
});

// Get User by ID
router.get('/:id', async (req, res) => {
  const params = { TableName: TABLE_NAME, Key: { id: req.params.id } };
  const data = await dynamoClient.get(params).promise();
  data.Item ? res.json(data.Item) : res.status(404).json({ error: 'User not found' });
});

// Update User
router.put('/:id', validateUser,async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id: req.params.id },
    UpdateExpression: "set #name = :name, email = :email",
    ExpressionAttributeNames: { "#name": "name" },
    ExpressionAttributeValues: {
      ":name": req.body.name,
      ":email": req.body.email
    },
    ReturnValues: "ALL_NEW"
  };
  const result = await dynamoClient.update(params).promise();
  res.json(result.Attributes);
});

// Delete User
router.delete('/:id', async (req, res) => {
  await dynamoClient.delete({ TableName: TABLE_NAME, Key: { id: req.params.id } }).promise();
  res.json({ deleted: true });
});

module.exports = router;
