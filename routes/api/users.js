const express=require('express');
const router=express.Router();
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');
const {check, validationResult}=require('express-validator');

//User model import
const User = require('../../models/User');


//@route  POST api/users
//@desc   Register User
//@access Public
router.post('/', [
    check('name','Name is required')
    .not()
    .isEmpty(),
    check('email','Please enter a valid email ').isEmail(),
   check('password',"Please enter a password with atleast 8 characters").isLength({min:8})
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }

    const {name,email,password}=req.body;

    try {
    //see if user exists
    let user=await User.findOne({email});
    if(user){
      return  res.status(400).json({errors:[{msg:"User already exists"}]});
    }
    //get users gravatar
    const avatar=gravatar.url(email,{
        s: '200',
        r:'pg',
        d:'mm'
    })

    user=new User({
        name,
        email,
        avatar,

    });
    //encrypt password
    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(password,salt);
    await user.save();

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