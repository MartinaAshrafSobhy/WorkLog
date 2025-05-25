

import {model,Schema} from "mongoose"

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true,
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        enum:['Admin','User'],
        default:"User"
    },
    

},{
    timestamps:true
})

const userModel=new model("User",userSchema)
export default userModel