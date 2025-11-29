const {Router} = require("express");
const jwt = require("jsonwebtoken");
const router = Router();
const { User, Blogs } = require("../db/index.js");
const {JWT_KEY} = require('../config.js');
const userMiddleware = require("../middlewares/user.js");

//SignUp for User (creation of new User)
router.post('/signup', async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;

    const userExists = await User.findOne({
        username,
        password
    })

    if(!userExists){
        const userCreation = await User.create({
            username: username,
            password: password
        })
        res.status(200).json({
            "msg": "User created successfully!!"
        })
    }
    else{
        res.status(400).json({
            "msg": "User already exists try SignIn instead!!!"
        })
    }
})

//SignIn (logging in the existing User)
router.post('/signin', async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;

    const adminExists = await User.findOne({
        username,
        password
    })
    if(!adminExists){
        res.status(400).json({
            "msg": 'Invalid username or password'
        })
    }
    else{
        const authToken = jwt.sign({username}, JWT_KEY);
        console.log(authToken);
        res.status(200).json({
            "msg": 'Signed in successfully!!!',
            "token": authToken
        })
    }
})

//View All Blogs
router.get('/blogs', async (req, res) => {
    const viewBlogs = await Blogs.find({})
    res.status(200).json({
        "blogsData": viewBlogs
    })
})

//View Specific Blog
router.get('/blogs/:blogId', userMiddleware, async (req, res) => {
    const blogId = req.params.blogId;

    const blogData = await Blogs.findById(blogId);

    if(!blogData){
        res.status(400).json({
            "msg": "Blog does not exist!!!"
        })
    }
    else{
        res.status(200).json({
            "msg": "Blog found!!",
            "blog": blogData
        })
    }
})

//Filter Based on Topic feild Ex: /blog-topic?t=tech
router.get('/blogs-topic', userMiddleware, async (req, res) => {
    const topicTerm = req.query.t;

    try{
        const topicBasedSearchData = await Blogs.find({
            topic: topicTerm
        })
        if(topicBasedSearchData.length === 0){
            res.status(404).json({
                msg: 'No search results found'
            })
        }
        else{
            res.status(200).json({
                "topicSearch": topicBasedSearchData
            })
        }
    }
    catch(e){
        res.status(400).json({
            msg: 'Invalid search topic term',
            error: e.message
        })
    }
})

//Add to Favourites (Adding users Favourite Blogs)
router.post('/add-favourite-blog/:blogId', userMiddleware, async (req, res) => {
    const blogId = req.params.blogId;
    const username = req.body.username;

    const blogExists = await Blogs.findById(blogId);

    if(!blogExists){
        res.status(400).json({
            'msg': 'Blog does not exists!!'
        })
    }
    else{
        const addingToFavourites = await User.updateOne(
            username,
            {
                $push: {favouriteBlogs: blogId}
            }
        )
        res.status(200).json({
            "msg": "Added to Favourites Successfully!!"
        })
    }

})

//Show Favaourite Blogs of User (User can see their favourite blogs that they have marked as favourite)
router.get('/my-favourite-blogs', userMiddleware, async (req, res) => {
    const username = req.username;

    const userExists = await User.findOne({
        username
    })

    if(!userExists){
        res.status(400).json({
            "msg": "User does not exist!!"
        })
    }
    else{
        const favouriteBlog = await Blogs.find({
            _id: {
                $in: userExists.favouriteBlogs
            }
        })
        res.status(200).json({
            "favourite-blogs": favouriteBlog
        })
    }
})

module.exports = router;