const express = require('express');
const user = require('../models/User');
const bryc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const s_secrete = "bikrambro"

router.post('/cuser',
 [body('name', 'enter a valid name').isLength({ min: 3 }),
body('email', 'enter a valid email').isEmail(),
body('password', 'enter a more secure password').isLength({ min: 5 })], async (req, resp) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return resp.status(400).json({ error: error.array() })
    }
    try {
        const data = {
            user: user.id
        }
        const auttoken = jwt.sign(data, s_secrete);
        console.log(auttoken);
        resp.send(auttoken)

        let User = await user.findOne({ email: req.body.email })
        console.log(User)
        if (User) {
            return resp.status(400).json({
                error: 'this is already exist'
            })
        }

        const salt = bryc.genSalt(10);
        const securepassword = await bryc.hash(req.body.password, salt)
        console.log(securepassword);
        User = await user.create({
            name: req.body.name,
            email: req.body.email,
            password: securepassword
        })
    } catch (error) {
        console.error(error.message);
        resp.status(500).send('some error occure in server')
    }
    // .then(user=>resp.json(user)).catch(error=>{console.log(error)
    //     resp.json({error:"please enter a unique email" , message:error.message})})


    //     const data=user(req.body);
    //    data.save()
    resp.json({
        "auth": "nive"
    })
   
  
})
//login authecation Route2 from user 
router.post('/login',
 [
body('email', 'enter a valid email').isEmail(),
body('password', 'cant be blank').exists()], async (req, resp) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return resp.status(400).json({ error: error.array() })
    }
    const {email,password}=req.body;
  try { 
    const User=await user.findOne({email});
    if(!User){
        return resp.status(400).json({
            error: ' this is a bad or credential'})
    }
  const comparepassword=await bryc.compare(password,User.password)
  if(!comparepassword){
    return resp.status(400).json({
        error: ' this is a bad or try correct password credential'})
  }
  const data = {
    user: user.id
}
const auttoken = jwt.sign(data, s_secrete);
console.log(auttoken);
resp.send({authtoken:auttoken})
    
  } catch (error) {
    // console.log(error.message)
    // error.status(500).send('some internal error')
  }
 
}
)


module.exports = router;