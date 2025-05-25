import joi from 'joi'
import { generalFields } from '../../utils/generalFeildes.js'






export const tokenSchema=joi.object({
    token:joi.string().required(),
}).required()


export const updateSchema=joi.object({
    authorization:joi.string(),
    userCode:joi.string(),
    note:joi.string().required(),
    date:joi.date().required(),
}).required()





