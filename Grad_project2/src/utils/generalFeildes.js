import joi from "joi";
import { Types } from 'mongoose';
export const validateObjectId=(value,helper)=>{
    return Types.ObjectId.isValid(value)? true: helper.message('invalid objectId')
}

export const generalFields={
    password: joi.string().pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')).required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    id:joi.string().custom(validateObjectId),
   
    file:joi.object({
        size:joi.number().positive(),
        path:joi.string(),
        filename:joi.string(),
        destination:joi.string(),
        mimetype:joi.string(),
        encoding:joi.string(),
        originalname:joi.string(),
        fieldname:joi.string(),
    })


}