const express=require('express');
const router=express.Router();
   router.get('/',(req,resp)=>{
    const obj={
        name:'bikram',
        password:'dhamibikram123'
    }
    resp.json(obj)
   })
   module.exports=router;