const express=require('express');
const { models } = require('mongoose');
const router=express.Router();
const auth=require('../../middleware/auth');
const jwt=require('jsonwebtoken');
const config=require('config');
const {check, validationResult}=require('express-validator');
const bcrypt=require('bcryptjs')

const User=require('../../models/User');

//@route  GET api/auth
//@desc   Auth route
//@access Public
router.get('/',auth, async (req,res)=>{
try {
    const user= await User.findById(req.user.id).select('-password');
    res.json(user);
} catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
}
});

//@route  POST api/auth
//@desc   Authenticate User and get token
//@access Public
router.post('/', [
   check('email','Please enter a valid email ').isEmail(),
   check('password',"Password is required").exists()
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }

    const {email,password}=req.body;

    try {
    //see if user exists
    let user=await User.findOne({email});
    if(!user){
      return  res.status(400).json({errors:[{msg:"Invalid Credentials"}]});
    }
    

    const isMatch=await bcrypt.compare(password,user.password); 
    if(!isMatch){
        return  res.status(400).json({errors:[{msg:"Invalid Credentials"}]});  
    }
    //return jsonwebtoken
    const payload={
        user:{
            id:user.id
        }
    };
    jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn:360000},
        (err,token)=>{
            if(err) throw err;
            res.json({token});
        }
        );

    //console.log(req.body);
    //res.send("User registered")   
    } catch (error) {
     console.error(error.message);
     res.status(500).send('Server error');   
    }
   
});

module.exports=router;