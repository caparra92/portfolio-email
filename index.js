require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const nodemailer = require('nodemailer');

const transporterOptions = {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    }

    
let transporter = nodemailer.createTransport(transporterOptions);
    
app.post('/email', (req, res) => {
    console.log(req)
    let body  = req.body;
    console.log(body)
    const mailOptions = {
        from: body.email,
        to: 'caparra0992@gmail.com',
        subject: `${body.name} - ${body.email}`,
        text: body.message
    }
        
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
});
    
res.send({
    ok: true,
    body
})
});

app.listen(port, ()=> {
    console.log(`Listen on port ${port}`);
});