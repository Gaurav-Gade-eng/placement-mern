const axios = require("axios");

/* ✅ UNIVERSAL EMAIL FUNCTION */
const sendEmail = async ({ to, subject, text }) => {
  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Placement Portal",
          email: process.env.BREVO_USER,
        },
        to: [{ email: to }],
        subject: subject,
        textContent: text,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent:", res.data);

  } catch (err) {
    console.log("❌ EMAIL ERROR:", err.response?.data || err.message);
    throw err;
  }
};

/* ✅ OTP FUNCTION */
const sendOTP = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  });
};

/* ✅ APPLICATION EMAIL */
const sendApplicationEmail = async ({
  studentName,
  email,
  company,
  drive,
  status,
  reason,
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
    text: message,
  });
};

module.exports = {
  sendEmail,
  sendOTP,
  sendApplicationEmail,
};