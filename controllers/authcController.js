const { signupSchema } = require("../middlewares/validator");
const User = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const { dohash, doHashvalidation, hmacProcess } = require("../utils/hashing");
const transport = require("../middlewares/sendEmail");
exports.signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signupSchema.validate({ email, password });
        if (error) {
            return res.status(401).json({
                success: false,
                message: error.details[0].message
            })
        }
        const exuser = await User.findOne({ email });
        if (exuser) {
            return res.status(401).json({
                success: false,
                message: 'User already exist'
            })
        }
        const hashpassword = await dohash(password, 10)
        const newUser = new User({
            email, password: hashpassword
        })
        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({
            success: true,
            message: 'user created successfully'
        })


    } catch (error) {
        console.log(error);
    }
}
exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signupSchema.validate({ email, password });
        if (error) {
            return res.status(401).json({
                success: false,
                message: error.details[0].message
            })
        }// uses objet document mapper not ORM 
        // this is used for NoSQL like database

        const user = await User.findOne({ email }).select('email password')
            .exec();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User already exist'
            })
        }
        const result = await doHashvalidation(password, user.password)
        if (!result) {
            return res.status(401).json({
                success: false,
                message: 'invalid credentials'
            })
        }
        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            verified: user.verified,

        }, process.env.TOKEN_SECRET,
            {
                expiresIn: '1d'
            }
        );
        res.cookie('Authorization', 'Bearer ' + token,
            {
                expires: new Date(Date.now() + 8 * 36000),
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "productino"
            }
        ).json({
            success: true,
            user: user.email,
            token: token,

            'message': 'logged in successfully'
        })

    } catch (error) {
        console.log(error);
    }
}

exports.signout = async (req, res) => {
    res.clearCookie('Authorization').status(200).json({
        success: true,
        message: 'logged out successfully'
    })
}

exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
        const exuser = await User.findOne({ email }).exec();
        if (!exuser) {
            return res.status(401).
                json({
                    success: true,
                    message: "user does not exist"
                })
        }
        if (exuser.verified) {
            return res.status(400).json({
                success: true,
                message: 'already verified '
            })
        }
        const code = Math.floor(Math.random()*100000).toString();
        let info = await transport.sendMail({
            from:process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to:exuser.email,
            subject:"verification code",
            html:'<h1>'+code+'</h1>'

        })
        if(info.accepted[0] === exuser.email){
            const hashcodedvalue = hmacProcess(code,process.env.HMAC_VERIFICATION_CODE_SECRET)
            exuser.verificationCode = hashcodedvalue;
            exuser.verificationCodeValidation = Date.now();
            await exuser.save();
            return res.status(200).json({
                success:true,
                message:'verification code sent to email'
            })
        }
        return res.status(400).json({
            success:false,
            message:'failed'
        })
    } catch (error) {
        console.log(error)
    }

}

exports.verifyVerificationCode =async(req,res)=>{
    const {email,providedCode} =req.body;
    try{
        const {error,value}= acceptCodeSchema.validate({
            email,providedCode
        })
        if(error){
            return res.status(400).json({
                success:false,
                message:error.details[0].message
            });            
        }
        const codedValue = providedCode.toString();
        const exuser = await User.findOne({email}).select(
            "verificationCodeValidation");
        if(!exuser){
            return res.send(400).json({
                success:false,
                message:'no user found'
            })
        }
        if(exuser.verified){
            return res.status(400).json({
                success:false,
                message:'already user veridied'
            })
        }
        if(!exuseruser.verificationCode || !exuser.verificationCodeValidation){
            return res.status(400).json({
                success:false,
                message:'something wrong with the code'
            })
        }
        if(Date.now() - exuser.verificationCodeValidation > 5*60*1000){
            return res.status(400).json({
                success:false,
                message:'code has been expired'
            })
        }
        const hasedCodeValue = hmacProcess(codedValue,process.env.HMAC_VERIFICATION_CODE_SECRET);

        if(hasedCodeValue===exuser.verificationCode){
            exuser.verified = true;
            exuser.verificationCode = undefined;
            exuser.verificationCodeValidation=undefined;
            await exuser.save();
            return res.status(200).json({
                success:true,
                message:'your account has been verified'
            })
        }
        return res.status(400).json({
            success:false,
            message:"unexpected error"
        })



    }catch(error){
        console.log(error);
    }

}


