const express= require('express');
const connectDB=require("./config/db");

const app= express();

//Connect to database
connectDB();

//Define Routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/posts'));


app.get('/', (req,res)=>res.send("API started running"));
const PORT= process.env.PORT || 5000 ;

app.listen(PORT,()=>console.log(`Server connected on PORT ${PORT}`));