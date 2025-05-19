import { Router } from "express";
import* as Acontroller from './attendance.controller.js'
import uploadFile,{fileValidation} from "../../utils/multer.js";
import auth from "../../middleware/auth.js";
import validation from '../../middleware/validation.js'
import { updateSchema } from "./atten.validation.js";
const router=Router()
router
.post('/import', uploadFile({ customValidation: fileValidation.excel }).single("file"),Acontroller.importAttendance)
.get('/allSheets',Acontroller.allSheets)
.patch('/update',auth(),validation(updateSchema),Acontroller.updateRecord)

export default router