const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel.js");
const Blogs = require("../models/blogsModel.js");
const {JWT_KEY} = require('../config.js');

//SignUp for Admin (creation of new Admin)
const adminSignUpController = async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;

    const adminExists = await Admin.findOne({username: username});

    if(!adminExists){
        const adminCreation = await Admin.create({
            username,
            password
        })
        res.status(200).json({
            msg: "Admin created successfully!"
        })
    }
    else{
        res.status(400).json({
            msg: "Admin already exists try (SignIn) instead!"
        })
    }
}

//SignIn (logging in the existing Admin)
const adminSignInController = async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;

    const adminExists = await Admin.findOne({
        username,
        password
    })
    if(!adminExists){
        res.status(400).json({
            msg: "Invalid username or password"
        })
    }
    else{
        const authToken = jwt.sign({username}, JWT_KEY);
        console.log(authToken);
        res.status(200).json({
            msg: "Signed in successfully!",
            token: authToken
        })
    }
}

//Creating Blogs
const creationController = async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const topic = req.body.topic;

    const newBlog = await Blogs.create({
        title: title,
        description: description,
        imageLink: imageLink,
        topic: topic.toLowerCase()
    })

    res.status(200).json({
        msg: "Blog created successfully!"
    })
}

//Updating Blogs
const updatingController = async (req, res) => {
    try{
        const blogId = req.params.blogId;
        const isValidBlogId = mongoose.isValidObjectId(blogId)

        if(!isValidBlogId){
            res.status(400).json({
                msg: "Invalid BlogID (or) BlogID not found!"
            })
        }
        else{
            const blogData = req.body;

            const updatedBlog = await Blogs.findByIdAndUpdate(
                blogId, {$set: {title: blogData.title, description: blogData.description}}, {new: true}
            )
            console.log(updatedBlog);
            res.status(200).json({
                msg: "Updated the blog successfully!"
            })
        }
    }
    catch(e){
        res.status(500).json({
            msg: "Error occured",
            error: e.message
        })
    }
}

//Deleting Blogs
const deletionController = async (req, res) => {
    const blogId = req.params.blogId;
    const isValidBlogId = mongoose.isValidObjectId(blogId);
    try{    
        if(!isValidBlogId){
            res.status(400).json({
                msg: "Invalid BlogID (or) BlogID not found!"
            })
        }

        else{
            const deletedBlog = await Blogs.findByIdAndDelete(blogId);
            console.log(deletedBlog);
            res.status(200).json({
                msg: "Removed the blog successfully!"
            })
        }
    }
    catch(e){
        res.status(500).json({
            msg: "Error Occured",
            error: e.message
        })
    }
}

module.exports = {
    adminSignInController,
    adminSignUpController,
    creationController,
    updatingController,
    deletionController
}