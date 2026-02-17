const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middlewares/userAuthMiddleware.js");
const { userSignUpController, userSignInController, getAllBlogs, getSpecificBlog, getSearchBasedBlogs, addToFavouriteBlogs, getFavouriteBlogs } = require("../controllers/userController.js");

router.post('/signup', userSignUpController);

router.post('/signin', userSignInController);

router.get('/blogs', getAllBlogs);

router.get('/blogs/:blogId', userMiddleware, getSpecificBlog);

router.get('/search', userMiddleware, getSearchBasedBlogs);

router.post('/add-favourite-blog/:blogId', userMiddleware, addToFavouriteBlogs);

router.get('/my-favourite-blogs', userMiddleware, getFavouriteBlogs);

module.exports = router;