const jwt = require('jsonwebtoken');
exports.identifier = (req,res,next)=>{
    let token;
    // this is done so as to check if the request is coming from postman or thunder client 

    if(req.headers.client == 'not-browser'){
        token = req.headers.authorization
    }
    else{
        token = req.cookies['Authorization']
    }
    if(!token){
        return res.status(403).json({
            success:true,
            message:'Unauthorized'
        })
   
    }
     try{
        // typical header looks like Bearer <token> leaving the bearer behind and using only the tokne
        const usertoken = token.split(' ')[1]
        const jwtverified = jwt.verify(usertoken,process.env.TOKEN_SECRET)
        if(jwtverified){
            req.user = jwtverified; // this is assign to req.user that is , it assigning the verifed tag and the user
            next();
        }else{
            throw new Error("error in the token")
        }
    }catch(error){
        console.log(error)
    }
}