const {JWT_KEY} = require("../config.js");
const jwt = require("jsonwebtoken");

const userMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    
    if(token === undefined || token.length === 0){
        res.status(401).json({
            msg: "Authorization header missing!"
        })
    }
    
    const splitToken = token.split(" ");
    const rawToken = splitToken[1];
    console.log(rawToken);

    try{
        const decodedAndVerifiedToken = jwt.verify(rawToken, JWT_KEY);

        const decodedUsername = decodedAndVerifiedToken.username

        if(decodedUsername){
            req.username = decodedUsername;
            next();
        }
        else{
            res.status(400).json({
                msg: "Username not found in the token"
            })
        }
    }
    catch(e){
        res.status(400).json({
            msg: "Invalid Inputs",
            error: e.message
        })
    }
}

module.exports = userMiddleware;