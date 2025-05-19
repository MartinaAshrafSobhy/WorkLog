import nodemailer from "nodemailer"


 const sendEmail= async ({from= process.env.EMAIL,to,subject,cc,text,html,attachments}={})=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
        tls:{
          rejectUnauthorized:false
        }
      });
      
      // async..await is not allowed in global scope, must use a wrapper
    
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: `"Route👻" ${from}`, // sender address
          to, 
          subject,
          cc, 
          text, 
          html,
          attachments 
        });
      
      return info.rejected.length?false:true
    
}
export default sendEmail