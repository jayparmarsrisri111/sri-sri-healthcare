const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const connectDB = async () => {
    try {
        const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/swasthyasetu';
        await mongoose.connect(connStr, {
            serverSelectionTimeoutMS: 2000
        });
        console.log(`✅ MongoDB Connected: ${connStr}`);
    } catch (err) {
        console.warn(`⚠️ MongoDB not reachable (${err.message}). Running with In-Memory Storage Cache mode.`);
    }
};

module.exports = connectDB;
