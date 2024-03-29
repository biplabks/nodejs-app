const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

//It's not going to be exported, that's why we can have it as a function
const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
    const inlined = juice(html);
    //console.log(html);
    return inlined;
}

exports.send = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
        from: `Biplab Saha <noreply@biplabks.com>`,
        to: options.user.email,
        subject: options.subject,
        html,
        text
    };
    const sendMail = promisify(transport.sendMail, transport);

    return sendMail(mailOptions);
}

// transport.sendMail({
//     from: 'Biplab Saha <bjbs.anjoy@gmail.com>',
//     to: 'biplab.ksaha@outlook.com',
//     subject: 'Just trying things out!',
//     html: 'Hey I <strong>love</strong> you',
//     text: 'Hey I **love you**'
// });
