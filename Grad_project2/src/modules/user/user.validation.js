import joi from 'joi'
import { generalFields } from '../../utils/generalFeildes.js'



export const signUPSchema=joi.object({
    name:joi.string().required(),
    password:generalFields.password.required(),
    code:joi.string().required(),
}).required()

export const logInSchema=joi.object({
      name:joi.string().required(),
    password:generalFields.password.required()
}).required()


export const tokenSchema=joi.object({
    token:joi.string().required(),
}).required()


export const addAdminSchema=joi.object({
    authorization:joi.string().required(),
    code:joi.string().required(),
    password:generalFields.password.required(),
}).required()

export const searchSchema=joi.object({
    userName:joi.string().required(),
    code:joi.string().required(),
}).required()




