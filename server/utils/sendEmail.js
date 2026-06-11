const nodemailer = require('nodemailer');

let cachedTransporter;
let transporterVerified = false;
let activeTransportConfig;

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

const getConfiguredPort = () => Number(getRequiredEnv('SMTP_PORT'));

const getSecureForPort = (port) => {
  if (getRequiredEnv('SMTP_SECURE')) {
    return getBooleanEnv('SMTP_SECURE');
  }

  return port === 465;
};

const createTransportConfig = ({ port, secure }) => ({
  host: getRequiredEnv('SMTP_HOST'),
  port,
  secure,
  family: 4,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 30000,
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

const getTransportConfigCandidates = () => {
  if (!hasSmtpConfig()) {
    throw new Error('SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_FROM.');
  }

  const configuredPort = getConfiguredPort();
  const candidates = [
    createTransportConfig({
      port: configuredPort,
      secure: getSecureForPort(configuredPort),
    }),
  ];

  if (configuredPort === 465) {
    candidates.push(createTransportConfig({ port: 587, secure: false }));
  }

  return candidates;
};

const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const [primaryConfig] = getTransportConfigCandidates();
  activeTransportConfig = primaryConfig;
  cachedTransporter = nodemailer.createTransport(primaryConfig);

  return cachedTransporter;
};

const verifySmtpTransporter = async () => {
  if (transporterVerified && cachedTransporter) {
    return activeTransportConfig;
  }

  const errors = [];

  for (const config of getTransportConfigCandidates()) {
    const transporter = nodemailer.createTransport(config);

    try {
      await transporter.verify();
      cachedTransporter = transporter;
      activeTransportConfig = config;
      transporterVerified = true;
      return config;
    } catch (error) {
      errors.push(`port ${config.port}: ${error.message}`);
    }
  }

  const smtpError = new Error(`SMTP connection failed: ${errors.join(' | ')}`);
  smtpError.code = 'SMTP_CONNECTION_FAILED';
  throw smtpError;
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
