const joi = require('joi');
exports.signupSchema = joi.object({
    email:joi.string().min(6).max(60).email({
        tlds:{
            allow:['com','net','in']
        }
    }),
    password:joi.string().required().min(8).max(100)
});
exports.signinSchema = joi.object({
    email:joi.string().min(6).max(60).email({
        tlds:{
            allow:['com','net','in']
        }
    }),
    password:joi.string().required().min(8).max(100)
});

exports.acceptCodeSchema = joi.object({
    email:joi.string().min(6).max(60).email({
        tlds:{
            allow:['com','net','in']
        }
    }),
    providedCode : joi.number().required
})

exports.changePasswordSchema = joi.object({
    newPassword:joi.string().required(),
    oldPassword:joi.string().required()
})

exports.createPostScehema = joi.object({
    title:joi.string().min(5).max(100).required(),
    description:joi.string().min(10).max(100).required(),
    userId:joi.string().required()
})