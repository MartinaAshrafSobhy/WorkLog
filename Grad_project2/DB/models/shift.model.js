import {Schema,Types,model} from 'mongoose'


const shiftSchema=new Schema({
    number:{
        type:String,
        required:true
    },
    startTime:String, //"hh:mm"
    endTime:String,
    userId:[{
        type:Types.ObjectId,
        ref:'User'
    }]
})

const shiftModel=new model("Shift",shiftSchema)
export default shiftModel