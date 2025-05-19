import express from "express"
import { config } from "dotenv"
import bootstrab from "./src/bootstrap.js"
import cors from 'cors'
const app=express()
const port=process.env.PORT


app.use(cors())

bootstrab(app,express)


app.listen(port,()=>{
console.log("server running")
})

