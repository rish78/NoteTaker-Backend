const client = require("../configs/db");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

exports.forgotpassword = (req,res) => {
    
    const {email} = req.body;

    client
        .query(`SELECT * FROM users WHERE email = '${email}';`)
        .then((data) => {
            if(data.rows.length===0){
                res.status(400).json({error:"Email does not exist"});
            }

            const username = data.rows[0].name;
            const resetLink = jwt.sign({
                    email:email,
                    date:new Date()
                },
                process.env.RESET_SECRET_KEY,
                { expiresIn: '10m' }
            );

            // update resetlink in db

            //send mail
            createEmailTemplate = () => {
                const html =
                    `
                   <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                     <tr>
                       <br>
                       <td class="container">
                         <div class="content" style="text-align:center">
                           <table role="presentation" class="main">
                             <tr>
                               <td class="wrapper">
                                 <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="font-family: Monospace, Times, serif">
                                   <tr>
                                     <td>
                                      <p>Hello ${username}! <br><br> We received a request to reset your password.</p>
                                      <hr>
                                       <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                         <tbody>
                                           <tr>
                                             <td align="left">
                                               <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                               </table>
                                             </td>
                                           </tr>
                                         </tbody>
                                       </table>
                                       <p style="font-size: large;">If you were the one to make this request, use the button below to reset your password. </p>
                                       <br>
                                           <h6 style="text-align:center;font-family: Helvetica, sans-serif;">
                                           <a href="http://127.0.0.1:5500/pages/reset/index.html?token=${resetLink}" target="_blank"><button>Click here to reset your password!</button></a>
                                           </h6>
                                           <p style="font-size: large;"> Hope you don't ever face a problem in accessing your notes again!<br><br>
                                           </p><p>Keep Noting!</p>
                                           <hr><hr>
                                       <br>
                                       
                                     </td>
                                   </tr>
                                 </table>
                               </td>
                             </tr>
                           </table>
                       `
                return html;
            }
            const emailTemplate = createEmailTemplate();

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: true,
                auth: {
                    type: 'OAuth2',
                    user: 'test70455@gmail.com',                                                 //Add your email here
                    pass: process.env.MAIL_PASS,                                                         //Add your password here
                    clientId: process.env.CLIENT_ID,                                                     //Add your client id here
                    clientSecret: process.env.CLIENT_SECRET,                                             //Add your client secret key here
                    refreshToken: process.env.REFRESH_TOKEN,                                             //Add your refresh token here
                    accessToken: process.env.ACCESS_TOKEN                                                //Add your access token
                }
            })

            
            var mail = {                                                                                 //Sending a Verification mail to the user
                from: "Note Maker <test70455@gmail.com>",                                      //Add your email here
                to: email,                                                                          //Add the email to whom you wish to send
                subject: 'Verify Account',
                html: emailTemplate
            }
                                                                  
            transporter.sendMail(mail, function (err, info) {                                        //Sending a mail only if flag is true
                if (err) {
                  console.log(`Error in sending mail: ${err}`);
                    res.status(500).json({error:`Error in sending mail!`});
                } else {
                    console.log("Email sent");
                    res.status(200).send({
                      message: "Check your mail", 
                      resetLink: resetLink,
                  })
                }
                transporter.close();
            });
            
            
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: "Databse error occured",
            })
        })
}