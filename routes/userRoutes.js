const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dynamoClient, TABLE_NAME } = require('../dynamoClient');
const validateUser = require('../middlewares/validateUser');

const router = express.Router();
// Create User
router.post('/', validateUser, async (req, res) => {
  try {
    console.log("create user");
    const user = { id: uuidv4(), ...req.body };
    await dynamoClient.put({ TableName: TABLE_NAME, Item: user }).promise();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/', (req, res) => {
  res.send('User route is working!');
});
// Get All Users
router.get('/', async (req, res) => {
  try {
    console.log("get all users");
    const data = await dynamoClient.scan({ TableName: TABLE_NAME }).promise();
    res.json(data.Items);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get User by ID
router.get('/:id', async (req, res) => {
  try {
    console.log("get user by id");
    const params = { TableName: TABLE_NAME, Key: { id: req.params.id } };
    const data = await dynamoClient.get(params).promise();
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update User
router.put('/:id', validateUser, async (req, res) => {
  try {
    console.log("update user");
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
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  try {
    console.log("delete user");
    await dynamoClient.delete({ TableName: TABLE_NAME, Key: { id: req.params.id } }).promise();
    res.json({ deleted: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
