import jwt from 'jsonwebtoken'
import userModel from '../../DB/models/user.model.js'
 
const roles={
    Admin:'Admin',
    User:'User'
}
 
const auth=(role=Object.values(roles))=>{
 return async(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
        return next (new Error ('please lolgIN  first',{cause:401}))
    }
    if(!authorization.startsWith(process.env.BEARER_TOKEN)){
        return next (new Error ('invalid token'))
    }
    const token=authorization.split(process.env.BEARER_TOKEN)[1]
    const payload=jwt.verify(token,process.env.SIGNUP_SIGNATURE)
    if(!payload._id){
        return next (new Error("invalid payload",{cause:404}))
    }
    const user=await userModel.findOne({_id:payload._id})
    if(!user){
        return next (new Error("invalid token",{cause:404}))
    }
    if(user.isDeleted==true){
        return next (new Error ("user is soft deleted,please log in again"))
    }
if(!role.includes(user.role)){
    return next(new Error('not authorized',{cause:401}))
}
    req.user=user
    next()
}
 }
export default auth