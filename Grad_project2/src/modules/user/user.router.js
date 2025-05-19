import { Router } from "express";
import*as userController from './user.controller.js'
import auth from "../../middleware/auth.js";
import *as userValidation from './user.validation.js'
import validation from '../../middleware/validation.js'
const router=Router()

router
.post('/signUp',validation(userValidation.signUPSchema),userController.signUp)
.post('/logIn',validation(userValidation.logInSchema),userController.logIn)
.patch('/addAdmin',auth(),validation(userValidation.addAdminSchema),userController.addAdmin)
.get('/search',validation(userValidation.searchSchema),userController.search)

export default router