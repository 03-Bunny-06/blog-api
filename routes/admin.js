const {Router} = require("express");
const jwt = require("jsonwebtoken");
const router = Router();
const {Admin, Blogs} = require('../db');
const {JWT_KEY} = require('../config.js');
const userMiddleware = require("../middlewares/user.js");
const adminMiddleware = require("../middlewares/admin.js");

//SignUp for Admin (creation of new Admin)
router.post('/signup', async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;

    const adminExists = await Admin.findOne({
        username,
        password
    })

    if(!adminExists){
        const adminCreation = await Admin.create({
            username,
            password
        })
        res.status(200).json({
            msg: 'Admin created successfully!!!'
        })
    }
    else{
        res.status(400).json({
            msg: 'Admin already exists try SignIn instead!!!'
        })
    }
})

//SignIn (logging in the existing Admin)
router.post('/signin', async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;

    const adminExists = await Admin.findOne({
        username,
        password
    })
    if(!adminExists){
        res.status(400).json({
            msg: 'Invalid username or password'
        })
    }
    else{
        const authToken = jwt.sign({username}, JWT_KEY);
        console.log(authToken);
        res.status(200).json({
            msg: 'Signed in successfully!!!'
        })
    }
})

//Creating Blogs
router.post('/create-blog', adminMiddleware, async (req, res) => {
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
        msg: 'Blog created successfully!!!'
    })
})

//Updating Blogs
router.put('/update-blog/:blogId', adminMiddleware, async (req, res) => {
    const blogId = req.params.blogId;
    const blogExists = await Blogs.findById(blogId);
    console.log(blogExists);

    if(!blogExists){
        res.status(400).json({
            "msg": "Blog not found!!"
        })
    }
    else{
        const blogData = req.body;

        const updatedDoc = await Blogs.updateOne(
            {_id: blogId}, {$set: {title: blogData.title, description: blogData.description}}
        )
        console.log(updatedDoc);
        res.status(200).json({
            "msg": "Updated the blog successfully!"
        })
    }
})

//Deleting Blogs
router.delete('/delete-blog/:blogId', adminMiddleware, async (req, res) => {
    const blogId = req.params.blogId;

    const blogExists = await Blogs.findById(blogId);
    if(!blogExists){
        res.status(400).json({
            "msg": "Blog not found"
        })
    }
    else{
        const deletedBlog = await Blogs.deleteOne(
            {_id: blogId}
        )
        console.log(deletedBlog);
        res.status(200).json({
            'msg': 'Removed the blog successfully!!!'
        })
    }
})

module.exports = router;