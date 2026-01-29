const {Router} = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const router = Router();
const { User, Blogs } = require("../db/index.js");
const {JWT_KEY} = require('../config.js');
const userMiddleware = require("../middlewares/user.js");

//SignUp for User (creation of new User)
router.post('/signup', async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;

    const userExists = await User.findOne({username: username});

    if(!userExists){
        const userCreation = await User.create({
            username: username,
            password: password
        })
        res.status(200).json({
            msg: "User created successfully!"
        })
    }
    else{
        res.status(400).json({
            msg: "User already exists try (SignIn) instead!"
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
            msg: 'Invalid username or password!'
        })
    }
    else{
        const authToken = jwt.sign({username}, JWT_KEY);
        console.log(authToken);
        res.status(200).json({
            msg: 'Signed in successfully!!!',
            token: authToken
        })
    }
})

//Pagination with pages and limit of number of entries to fetch for each page if page 2 is asked with limit 5 then we must
//skip the first 5 documents/entries from 0-4 and then return 5-10 entries as question is asked for page 2 with limit 5
//Pagination with Pages and Limit

//Performs both viewing all blogs or pagination with limit in the same API
router.get('/blogs', async (req, res) => {
    try{
        const p = req.query.page;
        const l = req.query.limit;
        console.log({p, l});

        const hasPagination = (p != (undefined || NaN || '') && l != (undefined || NaN || ''));
        console.log(hasPagination);

        //Making sure the valid number is not a negative number so there would be an issue to fetch the pages with limit.
        if (hasPagination){
            globalThis.page = Math.max(1, parseInt(p));
            globalThis.limit = Math.max(1, parseInt(l));
            console.log({page, limit})
        }

        const totalBlogs = await Blogs.countDocuments({});
        const totalPages = Math.ceil(totalBlogs/limit);

        let query = Blogs.find();

        //Here if the page we were trying to query is 5 but only 3 pages exist that gives an Falsy Value and in the same way if there are no documents
        //in the Collection the 0 would bu the totalBlogs that would not be greater than 0 that gives Falsy Value both these cases might give a
        //issue while trying to query so these cases are important.
        
        //Skip is used to skip the number of pages if the given page is above 1
        //For page = 1 limit = 5 it would be (1-1) * 5 = 0 so no skip straight up need to fetch the first five blogs.

        if (hasPagination){
            if (page > totalPages && totalBlogs > 0){
                res.status(400).json({
                    error: "The page does not exist!"
                })
            }

            const skip = (page - 1) * limit; 
            query = query.skip(skip).limit(limit);
            console.log({ page, limit, skip });
        }

        const blogsData = await query;

        res.status(200).json({
            totalBlogs: totalBlogs,
            ...(page && limit && {
                msg: "Pagination Succcessful",
                currentPage: page,
                limitForPage: limit,
                totalPages: totalPages
            })
            ,blogsData: blogsData
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
})

//View Specific Blog
router.get('/blogs/:blogId', userMiddleware, async (req, res) => {
    const blogId = req.params.blogId;
    const isValidBlogId = mongoose.isValidObjectId(blogId);

    if(!isValidBlogId){
        res.status(400).json({
            msg: "Invalid BlogID (or) BlogID not found!"
        })
    }

    else{
        const blogData = await Blogs.findById(blogId);

        res.status(200).json({
            msg: "The specific blog found!",
            blog: blogData
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
                msg: "No search results found (or) Invalid topic term!"
            })
        }
        else{
            res.status(200).json({
                searchedTopicData: topicBasedSearchData
            })
        }
    }
    catch(e){
        res.status(500).json({
            msg: "Error Occured",
            error: e.message
        })
    }
})

//Add to Favourites (Adding users Favourite Blogs)
router.post('/add-favourite-blog/:blogId', userMiddleware, async (req, res) => {
    try{
        const blogId = req.params.blogId; 
        const isValidBlogId = mongoose.isValidObjectId(blogId);

        if(!isValidBlogId){
            res.status(400).json({
                msg: "Invalid BlogID (or) BlogID not found!"
            })
        }

        else{
            const username = req.username;
            console.log(username);
            
            const addingToFavourites = await User.findOneAndUpdate(
                {username: username},
                {
                    $push: {favouriteBlogs: blogId}
                }
            )
            res.status(200).json({
                msg: "Added to Favourites Successfully!!"
            })
        }
    }
    catch(e){
        res.status(500).json({
            "error": e.message
        })
    }

})

//Show Favaourite Blogs of User (User can see their favourite blogs that they have marked as favourite)
router.get('/my-favourite-blogs', userMiddleware, async (req, res) => {
    const username = req.username;
    console.log(username);

    //Checks if the user exists in the User Collection/Table.
    const userExists = await User.findOne({
        username: username
    })

    //If user doesnot exists in the collection this gets executed or else the control reaches the else block.
    if(!userExists){
        res.status(400).json({
            "msg": "User does not exist!"
        })
    }
    else{
        const favouriteBlog = await Blogs.find({
            _id: {
                $in: userExists.favouriteBlogs
            }
        })
        res.status(200).json({
            favouriteBlogs: favouriteBlog
        })
    }
})

module.exports = router;