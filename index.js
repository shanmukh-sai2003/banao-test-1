const express = require('express');
const logger = require('morgan');
const makeConnection = require('./makeDbConnection');
const userRouter = require('./routes/userRoutes');
const app = express();

// middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes setup
app.use('/api/v1', userRouter);

// make DB connection
makeConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server listening at ${PORT}`);
});