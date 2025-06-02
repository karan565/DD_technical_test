# User API

This API lets you create, read, update, and delete users.

## Base URL

http://3.110.212.203:3000

## Endpoints

- **GET /users**  
  Get all users.

- **GET /users/:id**  
  Get a user by ID.

- **POST /users**  
  Create a new user.  
  Send user data in JSON.

- **PUT /users/:id**  
  Update user by ID.  
  Send updated data in JSON.

- **DELETE /users/:id**  
  Delete a user by ID.

## Example

To get all users:  
`GET http://3.110.212.203:3000/users`

To create a user, send JSON like:  
`{"name": "John", "email": "john@example.com"}`

---

Make sure port 3000 is open in your server firewall or security group.
