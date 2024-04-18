require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const { body, validationResult } = require('express-validator');
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
    
app.post(
    '/email',
    [body('name','Please fill your name').notEmpty().escape(),
    body('email','Email format is invalid').isEmail(),
    body('email','Email is empty').notEmpty(),
    body('message', 'Please fill your message').notEmpty()],
    (req, res, next) => {
        const result = validationResult(req);
        if(result.isEmpty()) {
            const mailOptions = {
                    from: req.body.email,
                    to: 'caparra0992@gmail.com',
                    subject: `${req.body.name} - ${req.body.email}`,
                    text: req.body.message
                }

                transporter.sendMail(mailOptions, function(err, data) {
                    if (err) {
                        res.send({
                            msg: err,
                            ok: false
                        });
                    } else {
                        res.send({
                            msg: "Email sent successfully",
                            ok: true
                        });
                    }
                });
        }
        res.send({ 
            errors: result.array(), 
        });
    // let body  = req.body;

    // const mailOptions = {
    //     from: body.email,
    //     to: 'caparra0992@gmail.com',
    //     subject: `${body.name} - ${body.email}`,
    //     text: body.message
    // }
        
    // transporter.sendMail(mailOptions, function(err, data) {
    //     if (err) {
    //         res.send({
    //             msg: err,
    //             ok: false
    //         });
    //     } else {
    //         res.send({
    //             msg: "Email sent successfully",
    //             ok: true
    //         });
    //     }
    // });
});

app.listen(port, ()=> {
    console.log(`Listen on port ${port}`);
});