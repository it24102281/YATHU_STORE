import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  BadgeDollarSign,
  Check,
  Copy,
  Landmark,
  MessageCircle,
  Smartphone,
  Wallet,
  X,
} from 'lucide-react';

const WHATSAPP_NUMBER = '94763442220';

const paymentOptions = [
  {
    id: 'bank-transfer',
    title: 'Bank Transfer',
    description: 'Send your deposit through bank transfer and share the payment slip.',
    icon: Landmark,
    details: [
      {
        heading: 'Commercial Bank',
        lines: ['8004605696', 'Satheeskumar Yathurshan', 'Bank: Commercial Bank'],
      },
      {
        heading: 'BOC Account',
        lines: ['0088378005', 'S Yathurshan', 'BOC (Bank of Ceylon)'],
      },
      {
        heading: 'Hatton National Bank (HNB)',
        lines: ['031020380269', 'S Yathurshan'],
      },
    ],
  },
  {
    id: 'digital-wallet',
    title: 'Digital Wallet',
    description: 'Contact support on WhatsApp to get the currently available wallet payment option.',
    icon: Smartphone,
    details: [
      {
        heading: 'Digital Wallet Support',
        lines: ['Message us on WhatsApp before payment.', 'We will share the currently available wallet payment option.'],
      },
    ],
  },
  {
    id: 'crypto',
    title: 'Crypto Currency',
    description: 'Use the Binance payment details below and share the transfer confirmation.',
    icon: BadgeDollarSign,
    details: [
      {
        heading: 'Binance ID',
        lines: ['506702645', 'Name: Yathuxo3'],
      },
    ],
  },
];

const formatLkr = (value) => {
  const amount = Number(value || 0);
  return `Rs. ${Number.isFinite(amount) ? amount.toFixed(2) : '0.00'} LKR`;
};

const WalletTopUpModal = ({ isOpen, onClose, customerName = 'Customer', currentBalance = 0 }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].id);
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setPaymentMethod(paymentOptions[0].id);
      setCopiedKey('');
    }
  }, [isOpen]);

  const selectedOption = useMemo(
    () => paymentOptions.find((option) => option.id === paymentMethod) || paymentOptions[0],
    [paymentMethod]
  );

  const whatsappLink = useMemo(() => {
    const normalizedAmount = Number(amount || 0);
    const safeAmount = Number.isFinite(normalizedAmount) && normalizedAmount > 0 ? normalizedAmount : 0;
    const message = `Hi, I want to add funds to my wallet.%0AName: ${customerName}%0AAmount: LKR ${safeAmount.toFixed(
      2
    )}%0APayment Method: ${selectedOption.title}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  }, [amount, customerName, selectedOption.title]);

  const handleCopyText = async (copyKey, textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedKey(copyKey);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === copyKey ? '' : current));
      }, 1800);
    } catch (error) {
      setCopiedKey('');
    }
  };

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/70 px-4 pb-6 pt-24 backdrop-blur-sm sm:pt-28"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] max-h-[calc(100vh-7rem)] overflow-y-auto sm:max-h-[calc(100vh-8rem)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-purple-200">
                  <Wallet className="h-4 w-4" />
                  Add Funds
                </div>
                <h3 className="mt-4 text-3xl font-black text-white">Deposit To Wallet</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Enter the amount, choose a payment option, and continue to support for payment confirmation.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-gray-400 transition hover:border-purple-400/30 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-[22px] border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
              Current Wallet Balance: <span className="font-bold text-white">{formatLkr(currentBalance)}</span>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-300">Deposit Amount</label>
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ''))}
                placeholder="Enter amount in LKR"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-white outline-none transition focus:border-purple-400/40"
              />
            </div>

            <div className="mt-6">
              <div className="mb-3 text-sm font-semibold text-gray-300">Payment Options</div>
              <div className="grid gap-3">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id)}
                    className={`rounded-[22px] border px-4 py-4 text-left transition ${
                      paymentMethod === option.id
                        ? 'border-purple-400/35 bg-purple-500/12'
                        : 'border-white/10 bg-white/[0.03] hover:border-purple-400/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl border border-white/10 bg-white/[0.04] p-2 text-purple-200">
                        <option.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{option.title}</div>
                        <div className="mt-1 text-sm leading-6 text-gray-400">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[22px] border border-purple-500/20 bg-purple-500/[0.07] px-5 py-5">
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-purple-200">Payment Details</div>
              <div className="mt-4 space-y-4">
                {selectedOption.details?.map((detail) => (
                  <div key={detail.heading} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div className="text-sm font-bold uppercase tracking-[0.16em] text-white">{detail.heading}</div>
                    <div className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
                      {detail.lines.map((line, index) => {
                        const copyKey = `${detail.heading}-${index}`;
                        return (
                          <div
                            key={line}
                            className="flex items-center justify-between gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2"
                          >
                            <div className="min-w-0 flex-1 break-words">{line}</div>
                            <button
                              type="button"
                              onClick={() => handleCopyText(copyKey, line)}
                              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-gray-300 transition hover:border-purple-400/30 hover:text-white"
                              aria-label={`Copy ${line}`}
                              title={`Copy ${line}`}
                            >
                              {copiedKey === copyKey ? (
                                <Check className="h-4 w-4 text-emerald-300" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[22px] border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-sm leading-6 text-amber-100">
              <div className="font-bold uppercase tracking-[0.18em] text-amber-200">Important Note</div>
              <div className="mt-3">Remark your name on slip / receipt.</div>
              <div className="mt-2">After payment, don&apos;t send your slip on my WhatsApp.</div>
            </div>

            <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.03] px-5 py-4">
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">Selected Deposit</div>
              <div className="mt-2 text-2xl font-black text-white">{formatLkr(amount || 0)}</div>
              <div className="mt-2 text-sm text-gray-400">
                Payment Method: <span className="font-semibold text-gray-200">{selectedOption.title}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                  boxShadow: '0 10px 28px rgba(34,197,94,0.22)',
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Continue On WhatsApp
              </a>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-semibold text-gray-200 transition hover:border-purple-400/25 hover:text-white"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default WalletTopUpModal;
