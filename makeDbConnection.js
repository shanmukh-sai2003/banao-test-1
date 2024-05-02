const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = `mongodb+srv://shanmukh:${process.env.DB_PWD}@atlascluster.xvry0av.mongodb.net/banao?retryWrites=true&w=majority&appName=AtlasCluster`;

async function makeConnection() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('connection established to database..');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = makeConnection;