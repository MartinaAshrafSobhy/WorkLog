import connection from "../DB/connection.js"
import { globalError } from "./utils/errorHandler.js"
import userRouter from './modules/user/user.router.js'
//import shiftRouter from './modules/shift/shift.router.js'
import attendanceRouter from './modules/attendance/attendance.router.js'
import MreportRouter from './modules/Mreport/report.router.js'
import auth from "./middleware/auth.js"
const bootstrab=(app,express)=>{
 app.use((req,res,next)=>{
    if(req.originalUrl=='order/webhook'){
      return next();
    }else{
         express.json({})(req,res,next);
    }
   
 })
 app.use("/user",userRouter)
 //app.use("/shift",shiftRouter)
 app.use("/attendance",attendanceRouter)
 app.use("/report",MreportRouter)
 app.use(globalError)
 
connection()
}
export default bootstrab