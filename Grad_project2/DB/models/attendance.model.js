import{Types, Schema,model} from 'mongoose'

const attendanceSchema=new Schema({
    date:Date,
    arrivalTime:String,
    leavingTime:String,
    day:String,
    status:{
        type:String,
        enum:['present','absent','late'],

        
    },
    
    shiftId:{
        type:Types.ObjectId,
        ref:"Shift"
    },
    userId:{
        type:Types.ObjectId,
        ref:"User"
    },
    Epermission:{
        type:String
    },
    Mpermission:{
        type:String
    },
    note:
        {
            type:String,
            trim:true
     },
    building:{
            type:String,
        }
    
})

const attendanceModel=new model("Attendance",attendanceSchema)
export default attendanceModel