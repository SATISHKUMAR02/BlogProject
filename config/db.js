const mongoose = require('mongoose');
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            // useNewUrlParser:true,
            // useUnifiedTopology:true
        });
        console.log("connected to mongoDB");
    }catch(error){
        console.log(error);
        console.log("failed");
        process.exit(1);
    }
}
module.exports = connectDB