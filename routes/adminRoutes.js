const { Router } = require("express");
const router = Router();
const adminMiddleware = require("../middlewares/adminAuthMiddleware.js");
const { adminSignUpController, adminSignInController, creationController, updatingController, deletionController } = require("../controllers/adminController.js");

router.post('/signup', adminSignUpController);

router.post('/signin', adminSignInController);

router.post('/create-blog', adminMiddleware, creationController);

router.put('/edit-blog/:blogId', adminMiddleware, updatingController);

router.delete('/delete-blog/:blogId', adminMiddleware, deletionController);

module.exports = router;