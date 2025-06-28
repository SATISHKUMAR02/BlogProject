const { createPostScehema } = require('../middlewares/validator');
const Post = require('../models/postsModel');
const { post } = require('../routers/api/authRouter');
exports.getPosts = async (req, res) => {
    const { page } = req.query; // this gets the page number from the url
    const postsPerPage = 10;
    try {
        let pageNum = 0;
        // making it to 0 based indexing
        m//mongodb skip() works with zero based index
        if (page <= 1) {
            pageNum = 0
        } else {
            pageNum = page - 1
        }
        const result = await Post.find.sort({
            createdAt: -1// this tells it sbould be in descending order in revere order
        }).skip(pageNum * postsPerPage).limit(postsPerPage)
            .populate({
                path: 'userId',
                select: 'email'
            })
        res.status(200).json({
            success: true,
            message: 'posts',
            data: result
        })

    } catch (error) {
        console.log(error);
    }

}
exports.getAllPosts = async (req, res) => {
    const posts = await Post.find();
    if (!posts) {
        return res.status(204).json({
            success: false,
            message: 'no employes'
        })
    }
    res.status(200).json({
        success: true,
        message: 'fetched successfully',
        data: posts
    })
}

exports.createPost = async (req, res) => {
    const { title, description } = req.body;
    const { userId } = req.user;
    try {
        const { error, value } = createPostScehema.validate({
            title, description, userId
        })
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'invalid inputs'
            })
        }
        const result = await Post.create({
            title, description, userId

        })
        res.status(201).json({
            success: true,
            message: 'post created successfully'
        })
    } catch (error) {
        console.log(error);
    }
}
exports.updatePost = async (req, res) => {
    const { _id } = req.query;
    const { title, description } = req.body;
    const { userId } = req.user;
    try {
        const { error, value } = createPostScehema.validate({
            title, description, userId
        })
        if (error) {
            return res.status(400).json({
                success: true,
                message: 'invalid inputs'
            })

        }
        const expost = await Post.findOne({ _id }).exec();
        if (!expost) {
            return res.status(404).json({
                success: false,
                message: 'no post found'
            })
        }
        if (expost.userId.toString() !== userId) {
            return res.status(404).json({
                success: false,
                message: 'unauth user to edit this post '
            })
        }
        expost.title = title;
        expost.description = description;
        const result = await expost.save();
        res.status(201).json({
            success:true,
            message:'updated successfully'
        })




    } catch (error) {
        console.log(error);
    }
}

exports.deletePost = async (req, res) => {
    const { _id } = req.query;
    const { title, description } = req.body;
    const { userId } = req.user;
    try {
        const { error, value } = createPostScehema.validate({
            title, description, userId
        })
        if (error) {
            return res.status(400).json({
                success: true,
                message: 'invalid inputs'
            })

        }
        const expost = await Post.findOne({ _id }).exec();
        if (!expost) {
            return res.status(404).json({
                success: false,
                message: 'no post found'
            })
        }
        if (expost.userId.toString() !== userId) {
            return res.status(404).json({
                success: false,
                message: 'unauth user to edit this post '
            })
        }
        
        await expost.deleteone();
        res.status(201).json({
            success:true,
            message:'deleted successfully'
        })
        



    } catch (error) {
        console.log(error);
    }
}