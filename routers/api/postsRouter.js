const express = require('express');
const router = express.Router();
 const postController = require('../../controllers/postController');
const { identifier } = require('../../middlewares/identification');
router.post('/create-post',postController.createPost);

module.exports = router;