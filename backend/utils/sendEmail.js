import nodemailer from 'nodemailer';

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

export const sendEmail=async(to,subject,html)=>{
    try{
      await transporter.sendMail({
        from:`"Finance Tracker" <${process.env.EMAIL_USER}`,
        to,
        subject,
        html,
      });
      console.log("email is send")
    }catch(errror){
        console.error('email send failed',errror.message);
        throw new Error('could not send email. please try ageain later')
    }
}




