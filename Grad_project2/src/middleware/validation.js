import { Types } from "mongoose";
export const idValidition=(value,helper)=>{
  return Types.ObjectId.isValid(value)?true:helper.message("Invaild Id")
}

const validation = (schema) => {
  return (req, res, next) => {
    try {
      let methods
    if(req.headers.authorization){
      
      methods={...req.body,...req.params,...req.query,authorization:req.headers.authorization}
    }
    else{
      methods={...req.body,...req.params,...req.query}
    }
    if(req.file){
      methods={...methods,file:req.file}
    }
    if(req.files){
      methods={...methods,files:req.files}
    }

    
    const validtionResult = schema.validate(methods)
    
    if (validtionResult?.error) {
      return res.json({ message: "validationError", validtionResult });
    }
    return next()
    } catch (error) {
      return res.status(500).json({
        message: error.message,
    stack:error.stack
    });
                
                
    }
    
  };
};

export default validation