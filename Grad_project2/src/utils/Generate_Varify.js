import  jwt  from "jsonwebtoken";
import { config } from "dotenv";
config()
export const GenerateToken=({payload={},signature=process.env.TOKEN_SEGNATURE,expiresIn=60*60}={})=>{
    const token=jwt.sign(payload,signature,{expiresIn:parseInt(expiresIn)})
    return token
}


export const varifyToken=({token,signature=process.env.TOKEN_SEGNATURE}={})=>{
const decoded=jwt.verify(token,signature)
return decoded
}