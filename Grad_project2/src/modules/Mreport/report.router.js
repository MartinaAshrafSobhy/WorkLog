import { Router } from "express";
import * as reportCotroller from './report.controller.js'
import validation from '../../middleware/validation.js'
import { reportSchema } from "./report.validation.js";
const router=Router()

router
.get('/Report',validation(reportSchema),reportCotroller.generateMonthlyReport)
.get('/ReportForUser',validation(reportSchema),reportCotroller.monthlyReportForUser)

export default router