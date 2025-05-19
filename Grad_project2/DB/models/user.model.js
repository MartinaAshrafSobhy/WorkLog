

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
    email:{
        type:String
    },
    confirmEmail:{
        type:Boolean,
        default:"false"
    }

},{
    timestamps:true
})

const userModel=new model("User",userSchema)
export default userModel