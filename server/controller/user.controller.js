import ErrorHandler from "../middleware/error.middleware.js";
import bcrypt from 'bcrypt'
import User from "../Schema/User.js";
import { nanoid } from 'nanoid'
import jwt from 'jsonwebtoken'


export const getUserBySearch=async(req,res,next)=>{
    const {query}=req.body;

    await User.find({"personal_info.username":new RegExp(query,"i")})
    .limit(10)
    .select("personal_info.username personal_info.fullname personal_info.profile_img -_id")
    .then((users)=>{
        return res.status(200).json({users})
    })
    .catch(err=>{
        return next(new ErrorHandler(err.message,500))
    })
}

