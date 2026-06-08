const fs = require('fs');
const path = require('path');

const priceFilePath = path.join(__dirname, '..', '..', 'social-services-prices.txt');
const sellingOverrideFilePath = path.join(__dirname, '..', '.cache', 'social-selling-price-overrides.json');

let cachedBasePrices = null;
let cachedBasePricesMtimeMs = 0;
let cachedSellingOverrides = null;
let cachedSellingOverridesMtimeMs = 0;

const parsePriceValue = (value) => {
  const match = String(value || '').match(/LKR\s+([\d.,]+)/i);
  if (!match) {
    return null;
  }

  const numericValue = Number(match[1].replace(/,/g, ''));
  return Number.isFinite(numericValue) ? Number(numericValue.toFixed(2)) : null;
};

const parsePriceRecords = (rawText) => {
  const lines = String(rawText || '').split(/\r?\n/);
  const records = new Map();
  let currentRecord = null;

  const finalizeRecord = () => {
    if (!currentRecord?.serviceId || !Number.isFinite(currentRecord.priceLkr)) {
      currentRecord = null;
      return;
    }

    records.set(String(currentRecord.serviceId), {
      serviceId: String(currentRecord.serviceId),
      platform: currentRecord.platform || '',
      category: currentRecord.category || '',
      service: currentRecord.service || '',
      priceLkr: Number(currentRecord.priceLkr.toFixed(2)),
    });
    currentRecord = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      finalizeRecord();
      continue;
    }

    if (line.startsWith('Platform: ')) {
      finalizeRecord();
      currentRecord = {
        platform: line.slice('Platform: '.length).trim(),
      };
      continue;
    }

    if (!currentRecord) {
      continue;
    }

    if (line.startsWith('Category: ')) {
      currentRecord.category = line.slice('Category: '.length).trim();
      continue;
    }

    if (line.startsWith('Service ID: ')) {
      currentRecord.serviceId = line.slice('Service ID: '.length).trim();
      continue;
    }

    if (line.startsWith('Service: ')) {
      currentRecord.service = line.slice('Service: '.length).trim();
      continue;
    }

    if (line.startsWith('Price: ')) {
      currentRecord.priceLkr = parsePriceValue(line);
      continue;
    }
  }

  finalizeRecord();
  return records;
};

const readJsonFile = (filePath) => {
  const rawText = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(rawText);
  return parsed && typeof parsed === 'object' ? parsed : {};
};

const getBaseSocialServicePrices = () => {
  try {
    const stats = fs.statSync(priceFilePath);

    if (cachedBasePrices && cachedBasePricesMtimeMs === stats.mtimeMs) {
      return cachedBasePrices;
    }

    const rawText = fs.readFileSync(priceFilePath, 'utf8');
    cachedBasePrices = parsePriceRecords(rawText);
    cachedBasePricesMtimeMs = stats.mtimeMs;
    return cachedBasePrices;
  } catch (error) {
    return new Map();
  }
};

const getDefaultSellingOverrides = () => ({
  '187': 250,
  '189': 350,
  '193': 2400,
  '194': 1800,
  '254': 1300,
  '291': 300,
});

const ensureSellingOverrideFile = () => {
  if (fs.existsSync(sellingOverrideFilePath)) {
    return;
  }

  fs.mkdirSync(path.dirname(sellingOverrideFilePath), { recursive: true });
  fs.writeFileSync(
    sellingOverrideFilePath,
    JSON.stringify(getDefaultSellingOverrides(), null, 2),
    'utf8'
  );
};

const getManualSellingPriceOverrides = () => {
  try {
    ensureSellingOverrideFile();
    const stats = fs.statSync(sellingOverrideFilePath);

    if (cachedSellingOverrides && cachedSellingOverridesMtimeMs === stats.mtimeMs) {
      return cachedSellingOverrides;
    }

    const parsed = readJsonFile(sellingOverrideFilePath);
    cachedSellingOverrides = Object.fromEntries(
      Object.entries(parsed)
        .map(([serviceId, priceLkr]) => [String(serviceId), Number(priceLkr)])
        .filter(([, priceLkr]) => Number.isFinite(priceLkr) && priceLkr >= 0)
    );
    cachedSellingOverridesMtimeMs = stats.mtimeMs;
    return cachedSellingOverrides;
  } catch (error) {
    return getDefaultSellingOverrides();
  }
};

const saveManualSellingPriceOverride = ({ serviceId, sellingPriceLkr }) => {
  ensureSellingOverrideFile();
  const currentOverrides = {
    ...getManualSellingPriceOverrides(),
    [String(serviceId)]: Number(Number(sellingPriceLkr || 0).toFixed(2)),
  };

  fs.writeFileSync(
    sellingOverrideFilePath,
    JSON.stringify(currentOverrides, null, 2),
    'utf8'
  );

  cachedSellingOverrides = currentOverrides;
  cachedSellingOverridesMtimeMs = fs.statSync(sellingOverrideFilePath).mtimeMs;
  return currentOverrides;
};

const getSellingPriceForService = ({ serviceId, fallbackPriceLkr = 0 }) => {
  const manualOverrides = getManualSellingPriceOverrides();

  if (Object.prototype.hasOwnProperty.call(manualOverrides, String(serviceId))) {
    return Number(Number(manualOverrides[String(serviceId)]).toFixed(2));
  }

  const basePrice = getBaseSocialServicePrices().get(String(serviceId))?.priceLkr;
  if (Number.isFinite(basePrice)) {
    return Number(basePrice.toFixed(2));
  }

  return Number(Number(fallbackPriceLkr || 0).toFixed(2));
};

module.exports = {
  getBaseSocialServicePrices,
  getManualSellingPriceOverrides,
  getSellingPriceForService,
  saveManualSellingPriceOverride,
};
