const nodemailer = require('nodemailer');
const https = require('https');

let cachedTransporter;
let transporterVerified = false;
let activeTransportConfig;

const getRequiredEnv = (key) => process.env[key]?.trim();
const getBooleanEnv = (key) => /^(true|1|yes)$/i.test(getRequiredEnv(key) || '');
const getSenderAddress = () => getRequiredEnv('EMAIL_FROM') || getRequiredEnv('SMTP_USER');

// Parse name and email from formats like: "Name <email@example.com>" or "email@example.com"
const parseSender = (senderStr) => {
  if (!senderStr) return { name: '', email: '' };
  const match = senderStr.match(/^(.*?)\s*<(.*?)>$/);
  if (match) {
    return {
      name: match[1].trim(),
      email: match[2].trim(),
    };
  }
  return {
    name: '',
    email: senderStr.trim(),
  };
};

// Check if any HTTP-based email delivery service API key is set
const useHttpApi = () =>
  Boolean(
    getRequiredEnv('RESEND_API_KEY') ||
      getRequiredEnv('SENDGRID_API_KEY') ||
      getRequiredEnv('BREVO_API_KEY')
  );

const getHttpProviderName = () => {
  if (getRequiredEnv('BREVO_API_KEY')) return 'Brevo';
  if (getRequiredEnv('RESEND_API_KEY')) return 'Resend';
  if (getRequiredEnv('SENDGRID_API_KEY')) return 'SendGrid';
  return null;
};

// Returns true if either SMTP or an HTTP API is configured
const hasSmtpConfig = () =>
  Boolean(
    useHttpApi() ||
      (getRequiredEnv('SMTP_HOST') &&
        getRequiredEnv('SMTP_PORT') &&
        getRequiredEnv('SMTP_USER') &&
        getRequiredEnv('SMTP_PASS') &&
        getSenderAddress())
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
    throw new Error('Email configuration is missing. Set BREVO_API_KEY, RESEND_API_KEY, SENDGRID_API_KEY, or SMTP environment variables.');
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

// Standard HTTPS POST client to send API payloads without extra npm dependencies
const sendViaHttp = (url, headers, bodyObj) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const bodyData = JSON.stringify(bodyObj);

    const options = {
      method: 'POST',
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyData),
        ...headers,
      },
      timeout: 10000, // 10s timeout
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, statusCode: res.statusCode, body: responseBody });
        } else {
          reject(new Error(`HTTP request failed with status ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('HTTP request timed out'));
    });

    req.write(bodyData);
    req.end();
  });
};

const sendViaHttpApi = async ({ to, subject, html, text }) => {
  const emailFrom = getSenderAddress();
  const { name: senderName, email: senderEmail } = parseSender(emailFrom);

  // 1. Brevo Integration
  if (getRequiredEnv('BREVO_API_KEY')) {
    const apiKey = getRequiredEnv('BREVO_API_KEY');
    const body = {
      sender: {
        name: senderName || 'YATHU PUBG STORE',
        email: senderEmail || 'yathupubg@gmail.com',
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text || subject,
    };

    await sendViaHttp(
      'https://api.brevo.com/v3/smtp/email',
      { 'api-key': apiKey },
      body
    );
    return {
      success: true,
      messageId: `brevo-${Date.now()}`,
    };
  }

  // 2. Resend Integration
  if (getRequiredEnv('RESEND_API_KEY')) {
    const apiKey = getRequiredEnv('RESEND_API_KEY');
    // Resend requires verified custom domains. If sender doesn't have one, Resend requires onboarding@resend.dev.
    const fromStr = emailFrom && !emailFrom.includes('gmail.com') && !emailFrom.includes('yahoo.com') && !emailFrom.includes('outlook.com')
      ? emailFrom
      : 'onboarding@resend.dev';

    const body = {
      from: fromStr,
      to: [to],
      subject,
      html,
      text: text || subject,
    };

    const result = await sendViaHttp(
      'https://api.resend.com/emails',
      { Authorization: `Bearer ${apiKey}` },
      body
    );
    const data = JSON.parse(result.body || '{}');
    return {
      success: true,
      messageId: data.id || `resend-${Date.now()}`,
    };
  }

  // 3. SendGrid Integration
  if (getRequiredEnv('SENDGRID_API_KEY')) {
    const apiKey = getRequiredEnv('SENDGRID_API_KEY');
    const body = {
      personalizations: [{ to: [{ email: to }] }],
      from: {
        email: senderEmail || 'yathupubg@gmail.com',
        name: senderName || 'YATHU PUBG STORE',
      },
      subject,
      content: [
        { type: 'text/plain', value: text || subject },
        { type: 'text/html', value: html || text },
      ],
    };

    await sendViaHttp(
      'https://api.sendgrid.com/v3/mail/send',
      { Authorization: `Bearer ${apiKey}` },
      body
    );
    return {
      success: true,
      messageId: `sendgrid-${Date.now()}`,
    };
  }

  throw new Error('No HTTP email API key configured');
};

const verifySmtpTransporter = async () => {
  if (useHttpApi()) {
    const provider = getHttpProviderName();
    console.log(`[Email] Using HTTP API provider: ${provider}`);
    const dummyConfig = { host: `${provider} API`, port: 443, secure: true, family: 'N/A' };
    transporterVerified = true;
    return dummyConfig;
  }

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
  if (useHttpApi()) {
    return sendViaHttpApi({ to, subject, html, text });
  }

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
