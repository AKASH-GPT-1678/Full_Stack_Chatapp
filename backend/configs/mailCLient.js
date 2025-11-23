
import nodemailer from "nodemailer";
const Email = process.env.Email;

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: Email,
        pass: "pllo ifeu sbcg otcc"
    }

});




async function sendEmail(to, subject, text) {
    console.log("to", Email);
    let mailDetails = {
        from: Email,
        to: to,
        subject: subject,
        text: text
    };
    await mailTransporter
        .sendMail(mailDetails,
            function (err, data) {
                if (err) {
                    console.log('Error Occurs');
                    console.log(err.message)
                } else {
                    console.log('Email sent successfully');
                }
            });


}


export {sendEmail};