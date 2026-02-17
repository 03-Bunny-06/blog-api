const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    favouriteBlogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blogs'
    }]
})

const User = mongoose.model('User', UserSchema);

module.exports = User;