
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENGRID_API_KEY)

const confirmMail= async(user)=>{
    const msg = {
        to: user.email, // Change to your recipient
        from: 'melaka.gamage@gmail.com', // Change to your verified sender
        subject: 'Please Confirm Your Account',
        html: `
        <p> Welcaome! ${user.name}  please confirm your account by clicking bellow link</p>
        <a href="http://localhost:3000/api/user/confirm_account?userid=${user._id}&secret=${user.secret}"> Confirm</a>
        `,
      }
    
      sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
}

module.exports={
    confirmMail:confirmMail
}