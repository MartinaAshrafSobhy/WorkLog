import multer from "multer";
import { nanoid } from "nanoid";
export const fileValidation={
    image:['image/png','image/gif','image/jpeg'],
    pdf:'application/pdf',
    excel: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ]
}
 const uploadFile=({customValidation}={})=>{
    const storage=multer.diskStorage({
        destination:function (req,file,cb){
            cb(null,'uploads')
        },
         filename:function(req,file,cb){
            const fileName=`${nanoid()}_${file.originalname}`
            file.finalDest=`uploads/${fileName}`
            cb(null,fileName)
         }   
    })
    const fileFilter=(req,file,cb)=>{
        if(customValidation.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new Error('invalid formate',false))
        }
    }
    const upload=multer({dest:'uploads',fileFilter,storage})
    return upload
 }
 export default uploadFile