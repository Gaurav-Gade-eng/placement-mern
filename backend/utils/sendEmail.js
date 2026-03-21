const nodemailer = require("nodemailer");

/* TRANSPORTER */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});


/* UNIVERSAL EMAIL FUNCTION */

const sendEmail = async ({ to, subject, text }) => {

  try {

    await transporter.sendMail({
      from: `"Placement Portal" <${process.env.EMAIL}>`,
      to,
      subject,
      text
    });

    console.log("✅ Email sent to:", to);

  } catch (err) {
    console.log("❌ Email error:", err);
    throw err;
  }

};


/* OTP FUNCTION (for forgot password) */

const sendOTP = async (email, otp) => {

  const message = `Your OTP for password reset is: ${otp}`;

  await sendEmail({
    to: email,
    subject: "Password Reset OTP",
    text: message
  });

};


/* APPLICATION EMAIL */

const sendApplicationEmail = async ({
  studentName,
  email,
  company,
  drive,
  status,
  reason
}) => {

  let message = "";

  if (status === "accepted") {

    message = `
Dear ${studentName},

🎉 Congratulations!

You're Application is Accepted For:

Company: ${company}
Drive: ${drive}

Best Regards,
TPO
`;

  }

  else {

    message = `
Dear ${studentName},

We regret to inform you're Application is not accepted.

Company: ${company}
Drive: ${drive}

Reason: ${reason || "Not specified"}

Best Regards,
TPO
`;

  }

  await sendEmail({
    to: email,
    subject: "Placement Drive Update",
    text: message
  });

};


module.exports = {
  sendEmail,
  sendOTP,
  sendApplicationEmail
};