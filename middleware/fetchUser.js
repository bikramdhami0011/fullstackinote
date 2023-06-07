// const jwt=require('jsonwebtoken');
// const s_secrete = "bikrambro"
// const fetchUser=(req,resp,next)=>{
//   next();
//   try {
//     const token=req.header('auth_token')
//     console.log(token)
//     if(!token){
//         req.status(400).send({
//             authentication:"please enter a valid token"
//         })
//     }
//     const data=jwt.verify(token,s_secrete);
//     req.header=data.header;

//   } catch (error) {
//     req.status(400).send({
//         authentication:"please enter a valid token"
//     })
//   }
  

// }
// module.exports=fetchUser;
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'bikrambro';

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header("set-header");
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        console.log(req.user)
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}
module.exports = fetchuser;