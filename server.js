const express= require('express');
const connectDB=require("./config/db");
const path=require("path");
const { dirname } = require('path');

const app= express();

//Connect to database
connectDB();

//Init middleware(Express has inbuilt alternatives for body parser)
app.use(express.json({extended: false}));






//Define Routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/posts'));


//serve static assets in production
if(process.env.NODE.ENV==='production'){
    //set static folder
    app.use(express.static('client/build'));
    app.get('*',(req,res)=>{
res.sendFile(path.resolve(__dirname,'client','build','index.html')); 
    });
}



const PORT= process.env.PORT || 5000 ;
app.listen(PORT,()=>console.log(`Server connected on PORT ${PORT}`));