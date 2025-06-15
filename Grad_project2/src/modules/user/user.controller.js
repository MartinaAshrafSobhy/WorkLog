import userModel from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandler.js"
import { compare, Hash } from "../../utils/Hash_Compare.js";
import {GenerateToken} from "../../utils/Generate_Varify.js"
import { hash } from "bcrypt";

export const signUp = asyncHandler(async (req, res, next) => {
  const { name,password,code } = req.body;

  const existingAdmin=await userModel.findOne({role:"Admin"})
  if (existingAdmin) {
    return res.status(403).json({ message: "Admin already exists. SignUp disabled." });
  }


  const isExist = await userModel.findOne({ name });
  if (isExist) {
    return next(new Error('not allowed', { cause: 409 }));
  }


  const hashPassword = Hash({ plaintext: req.body.password });
 
  const newAdmin = new userModel({
    name,
    password:hashPassword,
    code,
    role:"Admin"
  })
  await newAdmin.save()

  return res.status(201).json({ message: 'done', newAdmin });
});







export const logIn = asyncHandler(
async (req, res, next) => {
  const { name, password } = req.body;

  const userExist = await userModel.findOne({ name });
  if (!userExist) {
    return next(new Error("User does not exist"));
  }

  if (userExist.role !== "Admin") {
    return next(new Error("Only admin can access"));
  }

   if(!compare({plaintext:password,hashValue:userExist.password})){
            return next(new Error('invalid  password',{cause:400}))
        }

  const token = GenerateToken({
    payload: { _id: userExist._id, name: userExist.name },
    signature: process.env.SIGNUP_SIGNATURE,
    expiresIn: 60 * 60,
  });

  const ref_token = GenerateToken({
    payload: { _id: userExist._id, name: userExist.name },
    signature: process.env.SIGNUP_SIGNATURE,
    expiresIn: 60 * 60,
  });

  return res.status(200).json({ message: "done", token, ref_token });
});






export const addAdmin=asyncHandler(
    async(req,res,next)=>{
   
        const{code,password}=req.body


    if(req.user.role!="Admin"){
        return new Error("only admin can access",{cause:401})
    }

    const user=await userModel.findOne({code})
    if(!user){
        return new Error("user is not exist")
    }
    user.role="Admin"
    user.password=Hash({plaintext:password})
   

    await user.save()
    return res.status(200).json({message:"Done",user})
        })

export const search=asyncHandler(
    async(req,res,next)=>{

    const{userName,code}=req.body
    if(!userName && !code){
        return new Error("please provide either userName or code")}
    const user=await userModel.find({
        $or:[{name:userName},{code:code}]
    })
    if(!user){
        return new Error("user is not exist",{cause:404})
    }
    return res.status(200).json({message:"Done",user})

})
