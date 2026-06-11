const nodemailer = require('nodemailer');

let cachedTransporter;
let transporterVerified = false;

const getRequiredEnv = (key) => process.env[key]?.trim();
const getBooleanEnv = (key) => /^(true|1|yes)$/i.test(getRequiredEnv(key) || '');
const getSenderAddress = () => getRequiredEnv('EMAIL_FROM') || getRequiredEnv('SMTP_USER');

const hasSmtpConfig = () =>
  Boolean(
    getRequiredEnv('SMTP_HOST') &&
      getRequiredEnv('SMTP_PORT') &&
      getRequiredEnv('SMTP_USER') &&
      getRequiredEnv('SMTP_PASS') &&
      getSenderAddress()
  );

const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  if (!hasSmtpConfig()) {
    throw new Error('SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_FROM.');
  }

  const port = Number(getRequiredEnv('SMTP_PORT'));
  const secure = getRequiredEnv('SMTP_SECURE')
    ? getBooleanEnv('SMTP_SECURE')
    : port === 465;

  cachedTransporter = nodemailer.createTransport({
    host: getRequiredEnv('SMTP_HOST'),
    port,
    secure,
    family: 4,
    requireTLS: getRequiredEnv('SMTP_REQUIRE_TLS')
      ? getBooleanEnv('SMTP_REQUIRE_TLS')
      : port === 587,
    auth: {
      user: getRequiredEnv('SMTP_USER'),
      pass: getRequiredEnv('SMTP_PASS'),
    },
    tls: {
      rejectUnauthorized: !getBooleanEnv('SMTP_ALLOW_INVALID_CERT'),
    },
  });

  return cachedTransporter;
};

const verifySmtpTransporter = async () => {
  const transporter = getTransporter();

  try {
    await transporter.verify();
    transporterVerified = true;
    return true;
  } catch (error) {
    const smtpError = new Error(`SMTP connection failed: ${error.message}`);
    smtpError.code = 'SMTP_CONNECTION_FAILED';
    throw smtpError;
  }
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();

  if (!transporterVerified) {
    await verifySmtpTransporter();
  }

  const info = await transporter.sendMail({
    from: getSenderAddress(),
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

module.exports = { sendEmail, hasSmtpConfig, verifySmtpTransporter };
