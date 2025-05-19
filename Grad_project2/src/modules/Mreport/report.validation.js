import joi from 'joi'
import { generalFields } from '../../utils/generalFeildes.js'




export const reportSchema=joi.object({
    month:joi.string().required(),
    year:joi.string().required(),
    code:joi.string().required(),
}).required()


