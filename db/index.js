const env = require('dotenv')
env.config();

const dbUrl = process.env.DATABASE_URL;

const mongoose = require('mongoose');

mongoose.connect(dbUrl);

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
})

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    favouriteBlogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blogs'
    }]
})

const BlogsSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageLink: String,
    topic: String
})

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Blogs = mongoose.model('Blogs', BlogsSchema);

module.exports = {
    Admin,
    User,
    Blogs
}