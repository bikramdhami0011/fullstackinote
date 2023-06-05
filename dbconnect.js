const mongoose=require('mongoose');
const dbcon=async()=>{
await mongoose.connect('mongodb://0.0.0.0:27017/inote');
console.log('hello connct')
}
module.exports=dbcon;

