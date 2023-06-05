
const express=require('express');
const dbcon = require('./dbconnect');
dbcon()
const app=express();
app.use(express.json())
app.use('/api/auth',require('./routes/auth'));
app.listen(4001);

