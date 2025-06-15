import { Router } from "express";
import * as reportCotroller from './report.controller.js'
import validation from '../../middleware/validation.js'
import { reportSchema,reportUserSchema } from "./report.validation.js";
const router=Router()

router
.get('/Report',reportCotroller.generateMonthlyReport)
.get('/ReportForUser',validation(reportUserSchema),reportCotroller.monthlyReportForUser)

export default router