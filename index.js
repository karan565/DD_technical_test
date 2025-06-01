const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('User API running in ECS container');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
