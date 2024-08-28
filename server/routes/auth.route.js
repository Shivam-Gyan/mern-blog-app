import express from "express";

const userAuthRouter=express.Router();



userAuthRouter
.post('/signin',(req,res)=>{
    console.log(req.body);
    res.json({
        message:"success"
    })
    
})

export default userAuthRouter;