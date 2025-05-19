import mongoose from 'mongoose';

  const connection=async()=>{
 return await mongoose.connect(process.env.CONNECTION)
 .then(()=>{
    console.log("db connected")
 }).catch((err)=>{
 console.error("❌ Failed to connect to DB:", err.message);
  
 })
 }
export default connection