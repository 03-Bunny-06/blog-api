const mongoose = require('mongoose');
const env = require('dotenv')
env.config();

const connectDb = async() => {
    try{
        const dbUrl = process.env.DATABASE_URL;
        await mongoose.connect(dbUrl);
        console.log("Database connection successful ✅")
    }
    catch(e){
        console.log("Mongo DB error❌: ", e.message);
    }
}

module.exports = connectDb;