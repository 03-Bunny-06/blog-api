const mongoose = require('mongoose');

const BlogsSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageLink: String,
    topic: String
})

const Blogs = mongoose.model('Blogs', BlogsSchema);

module.exports = Blogs;