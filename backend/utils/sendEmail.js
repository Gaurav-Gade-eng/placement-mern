const nodemailer = require("nodemailer");

/* ✅ TRANSPORTER */
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "ec34053beebf35",
    pass: "40d657bc1e39a0"
  }
});

/* ✅ UNIVERSAL EMAIL FUNCTION */
const sendEmail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: `"Placement Portal" <no-reply@placement.com>`,
      to,
      subject,
      text
    });

    console.log("✅ Email sent to:", to);

  } catch (err) {
    console.log("❌ FULL EMAIL ERROR:", err);
    throw err;
  }
};

/* ✅ OTP FUNCTION */
const sendOTP = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`
  });
};

/* ✅ APPLICATION EMAIL */
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

Your Application is Accepted For:

Company: ${company}
Drive: ${drive}

Best Regards,
TPO
`;
  } else {
    message = `
Dear ${studentName},

We regret to inform your Application is not accepted.

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