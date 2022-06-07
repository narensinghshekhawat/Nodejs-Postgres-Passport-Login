if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

var nodeMailer = require('nodemailer');

/*  // For Email you have to make entries in .env file
    EMAIL=<Your-Gmail-Id>
    PASSWORD=<Generate APP Password of your Gmail Account>
    EMAIL_SEND_HOST=smtp.gmail.com
    EMAIL_SEND_PORT=587
    EMAIL_SEND_IS_SECURE=false
    EMAIL_SEND_REQUIRE_TLS=true 
*/

var transport = nodeMailer.createTransport({
	host : process.env.EMAIL_SEND_HOST,
	port: process.env.EMAIL_SEND_PORT,
	secureConnection: process.env.EMAIL_SEND_IS_SECURE,
	requireTLS:process.env.EMAIL_SEND_REQUIRE_TLS,
	auth:{
	      user: process.env.EMAIL,
	      pass: process.env.PASSWORD
	},
    tls: {
             ciphers:'SSLv3'
         }
});

/* var mailOptions = {
	from : 'narendra.shekhawat@gmail.com',
    to : 'neetu.rathore1606@gmail.com',
	subject : 'test node mail',
	text:'Hello Please Sub Channel'
}*/

var sendWelcomeEmail = (mailOptions) => {
    console.log('In sendWelcomeEmail >>> '+mailOptions.from);
    transport.sendMail(mailOptions,function(error,info){
        if(error){
            console.warn(error);
        }else{
            console.warn("email has been sent", info.response);
        }
    })    
}

module.exports = {
	sendWelcomeEmail: sendWelcomeEmail
}
