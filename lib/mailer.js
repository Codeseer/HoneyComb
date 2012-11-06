var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "group5honeycomb@gmail.com",
        pass: "SPSU2012"
    }
});

// send mail with defined transport object
exports.mail = function(mailOptions, cb) {
    smtpTransport.sendMail(mailOptions, cb);
};