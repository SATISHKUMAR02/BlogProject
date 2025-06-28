const express = require('express');
const router = express.Router();
 const postController = require('../../controllers/postController');
const { identifier } = require('../../middlewares/identification');
router.get('/getposts',postController.getPosts)
router.post('/create-post',identifier,postController.createPost);
router.delete('delete-post',identifier,postController.deletePost);
router.put('update-post',identifier,postController.updatePost);

module.exports = router;