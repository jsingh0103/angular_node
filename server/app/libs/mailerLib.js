const nodemailer = require('nodemailer')
const authConfig = require("./../../config/auth.config")
const user = authConfig.user
const pass = authConfig.pass

var transporter  = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: pass
    }
})


module.exports.sendConfirmationEmail = (confirmation_message,mail_subject,messageType,name, email) => {
    console.log("Mail sent")
    transporter.sendMail({
      from: user,
      to: email,
      subject: mail_subject,
      html: `<h1>${confirmation_message}</h1>
          <h2>Hello ${ name }</h2>
          <p>You have successfully ${ messageType }. Have a good day.</p>
          </div>`,
    }).catch(err => console.log(err));
  };