const { number } = require('joi');
const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email:{
        type:String,
        require:[true,'Email is Required'],
        trim:true,
        unique:[true,'email must be unique'],
        minLength:[5,'atleast 5 characters'],
        lowercase:true,
    },
    password:{
        type:String,
        required:[true,'password is required'],
        trim:true,
        minLength:[8,'atleast 8 characters'],
        select:false
    },
    verified:{
        type:Boolean,
        default:false,
    },
    verificationCode:{
        type:Number,
        default:false
    },
    verificationCodeValidation:{
        type:Number,
        select:false,

    },
    forgotPasswordCode:{
        type:String,
        select:false
    },
    forgotPasswordCodeValidation:{
        type:Number,
        select:false
    }
},{
    timestamps:true // will automatically keep track when created and updated
});

module.exports = mongoose.model('User',userSchema);