import joi from 'joi'
import { generalFields } from '../../utils/generalFeildes.js'




export const reportUserSchema=joi.object({
    month:joi.string(),
    year:joi.string().required(),
    code:joi.string(),
}).required()

export const reportSchema=joi.object({
    month:joi.string(),
    year:joi.string().required(),
   
}).required()



