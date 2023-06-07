// const express = require('express');
// var fetchUser=require('../middleware/fetchUser')
// const user = require('../models/User');
// const bryc = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { body, validationResult } = require('express-validator');
// const router = express.Router();
// const s_secrete = "bikrambro"

// router.post('/cuser',
//  [body('name', 'enter a valid name').isLength({ min: 3 }),
// body('email', 'enter a valid email').isEmail(),
// body('password', 'enter a more secure password').isLength({ min: 5 })], async (req, resp) => {
//     const error = validationResult(req);
//     if (!error.isEmpty()) {
//         return resp.status(400).json({ error: error.array() })
//     }
//     try {
//         const data = {
//             user: user.id
//         }
//         const auttoken = jwt.sign(data, s_secrete);
//         console.log(auttoken);
//         resp.send(auttoken)

//         let User = await user.findOne({ email: req.body.email })
//         console.log(User)
//         if (User) {
//             return resp.status(400).json({
//                 error: 'this is already exist'
//             })
//         }

//         const salt =await bryc.genSalt(10);
//         const securepassword = await bryc.hash(req.body.password, salt)
//         console.log(securepassword);
//         User = await user.create({
//             name: req.body.name,
//             email: req.body.email,
//             password: securepassword
//         })
//     } catch (error) {
//         console.error(error.message);
//         resp.status(500).send('some error occure in server')
//     }
//     // .then(user=>resp.json(user)).catch(error=>{console.log(error)
//     //     resp.json({error:"please enter a unique email" , message:error.message})})


//     //     const data=user(req.body);
//     //    data.save()
//     resp.json({
//         "auth": "nive"
//     })
   
  
// })
// //login authecation Route2 from user 
// router.post('/login',
//  [
// body('email', 'enter a valid email').isEmail(),
// body('password', 'cant be blank').exists()], async (req, resp) => {
//     const error = validationResult(req);
//     if (!error.isEmpty()) {
//         return resp.status(400).json({ error: error.array() })
//     }
//     const {email,password}=req.body;
//   try { 
//     const User=await user.findOne({email});
//     if(!User){
//         return resp.status(400).json({
//             error: ' this is a bad or credential'})
//     }
//   const comparepassword=await bryc.compare(password,User.password)
//   if(!comparepassword){
//     return resp.status(400).json({
//         error: ' this is a bad or try correct password credential'})
//   }
//   const data = {
//     user: user.id
// }
// const auttoken = jwt.sign(data, s_secrete);
// console.log(auttoken);
// resp.send({authtoken:auttoken})
    
//   } catch (error) {
//     // console.log(error.message)
//     // error.status(500).send('some internal error')
//   }
 
// }
// )
// //fetch the details of users 
// router.post('/getuser',fetchUser, async (req, resp) => {
 
//  try {
//   var  userId=req.user.id;
//     console.log(userId)
//     const User= await user.findById(userId).select('-password');

//     resp.send(User);
//  } catch (error) {
//     console.error(error.message);
//     resp.status(500).send('internal server error');
//  }
 
// }
// )



// module.exports = router;
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchUser');

const JWT_SECRET = 'bikrambro'

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);


    // res.json(user)
    res.json({ authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
       
      }
      
    }
    // console.log(data)
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }


});


// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
// router.post('/getuser', fetchuser,  async (req, res) => {

//   try {
//    const userId = req.user.id;
//     const user = await User.findById(userId).select("-password")
//     res.send(user)
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// })
router.post('/getuser', fetchuser,  async (req, res) => {

 
  try {
    let userId =req.user.id;
  
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports=router;