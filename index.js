const express = require('express');
const PORT = 8000;
const db = require('./models');
require('dotenv').config();

const server = express();
server.use(express.json());
server.use(express.static('./public'))

server.get('/', (req, res) => {
    res.status(200).send('This is my API');
})

const { authRouter, blogRouter, userRouter } = require('./router');

server.use('/auth', authRouter);
server.use('/blog', blogRouter);
server.use('/user', userRouter);

server.listen(PORT, () => {
    // db.sequelize.sync({alter: true})
})