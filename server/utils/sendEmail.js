const nodemailer = require('nodemailer');

let cachedTransporter;

const getRequiredEnv = (key) => process.env[key]?.trim();

const hasSmtpConfig = () =>
  Boolean(
    getRequiredEnv('SMTP_HOST') &&
      getRequiredEnv('SMTP_PORT') &&
      getRequiredEnv('SMTP_USER') &&
      getRequiredEnv('SMTP_PASS') &&
      getRequiredEnv('EMAIL_FROM')
  );

const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  if (!hasSmtpConfig()) {
    throw new Error('SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_FROM.');
  }

  cachedTransporter = nodemailer.createTransport({
    host: getRequiredEnv('SMTP_HOST'),
    port: Number(getRequiredEnv('SMTP_PORT')),
    secure: Number(getRequiredEnv('SMTP_PORT')) === 465,
    auth: {
      user: getRequiredEnv('SMTP_USER'),
      pass: getRequiredEnv('SMTP_PASS'),
    },
  });

  return cachedTransporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();

  const info = await transporter.sendMail({
    from: getRequiredEnv('EMAIL_FROM'),
    to,
    subject,
    text,
    html,
  });

  return {
    success: true,
    messageId: info.messageId,
  };
};

module.exports = { sendEmail, hasSmtpConfig };
