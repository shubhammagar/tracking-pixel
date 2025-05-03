const mailer = require('nodemailer');

const  transporter = mailer.createTransport({
    service :'gmail',
    auth :{
        user : 'magarshubham13@gmail.com',
        pass: 'qvdp dsfl hzfm cxdd'

    }
})

const mailOptions = {
    from:'magarshubham13@gmail.com',
    to:'2015bpr009@sggs.ac.in',
    subject:'Test Email',
    html:`<p>this is test email with tracking pixel</p>
    <img src="https://tracking-pixel-sh3x.onrender.com/pixel?id=user123" alt="tracking pixel" width="1" height="1" style="display:none;" />
    `
}

transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        console.log('Error sending email:',error)
    } else {
        console.log('EMail sent',info.response)
    }
})