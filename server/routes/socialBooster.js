const express = require('express');
const { adminMiddleware } = require('../middleware/auth');
const { userMiddleware } = require('../middleware/auth');
const validator = require('validator');
const Order = require('../models/Order');
const Refill = require('../models/Refill');
const {
  getResellerStatus,
  getResellerServices,
  getResellerBalance,
  getResellerOrderStatus,
  getResellerOrdersStatus,
  placeResellerOrder,
  requestResellerRefill,
  getResellerRefillsStatus,
} = require('../services/resellerClient');
const {
  getSellingPriceForService,
  saveManualSellingPriceOverride,
} = require('../utils/socialServicePrices');

const router = express.Router();
const inrToLkrRate = Number(process.env.INR_TO_LKR_RATE || 3.65);
const markupPercent = Number(process.env.PRICE_MARKUP_PERCENT || 0);

const calculateLkrRate = (inrRate) => {
  const baseLkrRate = Number(inrRate || 0) * inrToLkrRate;
  const markupAmount = baseLkrRate * (markupPercent / 100);
  return Number((baseLkrRate + markupAmount).toFixed(2));
};

const calculateSupplierCostLkr = (inrRate) => Number((Number(inrRate || 0) * inrToLkrRate).toFixed(2));

const getCidOrderId = (payload) =>
  String(
    payload?.order ||
      payload?.order_id ||
      payload?.id ||
      payload?.data?.order ||
      payload?.data?.order_id ||
      ''
  ).trim();

const getAverageTime = (service) =>
  service.average_time ||
  service.averageTime ||
  service.avg_time ||
  service.avgTime ||
  service.delivery_time ||
  service.deliveryTime ||
  '';

const normalizeService = (service) => {
  const serviceId = String(service.service ?? service.serviceId ?? '');
  const supplierCostInr = Number(Number(service.rate || 0).toFixed(2));
  const supplierCostLkr = calculateSupplierCostLkr(supplierCostInr);
  const fallbackSellingPriceLkr = calculateLkrRate(Number(service.rate || 0));
  const sellingPriceLkr = getSellingPriceForService({
    serviceId,
    fallbackPriceLkr: fallbackSellingPriceLkr,
  });
  const profitLkr = Number((sellingPriceLkr - supplierCostLkr).toFixed(2));

  return {
    serviceId,
    cid_service_id: serviceId,
    name: service.name || service.service_name || 'Unnamed Service',
    category: service.category || 'General',
    type: service.type || '',
    rate: sellingPriceLkr,
    supplier_cost_inr: supplierCostInr,
    supplier_cost_lkr: supplierCostLkr,
    cid_price_inr: supplierCostInr,
    price_lkr: sellingPriceLkr,
    selling_price_lkr: sellingPriceLkr,
    profit_lkr: profitLkr,
    min: Number(service.min || 0),
    max: Number(service.max || 0),
    description: service.description || '',
    averageTime: getAverageTime(service),
    dripfeed: Boolean(service.dripfeed),
    refill: Boolean(service.refill),
    cancel: Boolean(service.cancel),
    platform: inferPlatform({
      category: service.category || 'General',
      name: service.name || service.service_name || 'Unnamed Service',
    }),
  };
};

const toPublicService = (service) => ({
  serviceId: service.serviceId,
  cid_service_id: service.cid_service_id,
  name: service.name,
  category: service.category,
  type: service.type,
  price_lkr: service.selling_price_lkr,
  selling_price_lkr: service.selling_price_lkr,
  min: service.min,
  max: service.max,
  description: service.description,
  averageTime: service.averageTime,
  dripfeed: service.dripfeed,
  refill: service.refill,
  cancel: service.cancel,
  platform: service.platform,
});

const inferPlatform = (service) => {
  const text = `${service.category} ${service.name}`.toLowerCase();
  if (text.includes('tiktok')) return 'TikTok';
  if (text.includes('instagram')) return 'Instagram';
  if (text.includes('facebook')) return 'Facebook';
  if (text.includes('youtube')) return 'YouTube';
  if (text.includes('twitter') || text.includes('x ')) return 'Twitter/X';
  return 'Social Media';
};

router.get('/status', (req, res) => {
  return res.json({
    success: true,
    data: getResellerStatus(),
  });
});

router.get('/services', async (req, res) => {
  try {
    const services = await getResellerServices();
    const normalizedServices = Array.isArray(services) ? services.map(normalizeService) : [];
    const publicServices = normalizedServices.map(toPublicService);
    const categories = Array.from(new Set(publicServices.map((service) => service.category).filter(Boolean)));
    const platforms = Array.from(new Set(publicServices.map((service) => service.platform).filter(Boolean)));

    return res.json({
      success: true,
      data: publicServices,
      meta: {
        total: publicServices.length,
        categories,
        platforms,
        inrToLkrRate,
        markupPercent,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch reseller services',
      error: process.env.NODE_ENV === 'development' ? error.raw || error.message : undefined,
    });
  }
});

router.get('/admin/services', adminMiddleware, async (req, res) => {
  try {
    const services = await getResellerServices();
    const normalizedServices = Array.isArray(services) ? services.map(normalizeService) : [];

    return res.json({
      success: true,
      data: normalizedServices.map((service) => ({
        serviceId: service.serviceId,
        cid_service_id: service.cid_service_id,
        name: service.name,
        category: service.category,
        type: service.type,
        platform: service.platform,
        description: service.description,
        averageTime: service.averageTime,
        min: service.min,
        max: service.max,
        supplierCostInr: service.supplier_cost_inr,
        supplierCostLkr: service.supplier_cost_lkr,
        sellingPriceLkr: service.selling_price_lkr,
        profitLkr: service.profit_lkr,
      })),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch admin social booster services',
      error: process.env.NODE_ENV === 'development' ? error.raw || error.message : undefined,
    });
  }
});

router.put('/admin/services/:serviceId', adminMiddleware, async (req, res) => {
  try {
    const serviceId = String(req.params.serviceId || '').trim();
    const sellingPriceLkr = Number(req.body?.sellingPriceLkr);

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: 'serviceId is required',
      });
    }

    if (!Number.isFinite(sellingPriceLkr) || sellingPriceLkr < 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid selling price is required',
      });
    }

    saveManualSellingPriceOverride({
      serviceId,
      sellingPriceLkr,
    });

    const services = await getResellerServices({ forceRefresh: false });
    const normalizedServices = Array.isArray(services) ? services.map(normalizeService) : [];
    const updatedService = normalizedServices.find((service) => service.serviceId === serviceId);

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    return res.json({
      success: true,
      message: 'Selling price updated successfully.',
      data: {
        serviceId: updatedService.serviceId,
        cid_service_id: updatedService.cid_service_id,
        name: updatedService.name,
        category: updatedService.category,
        type: updatedService.type,
        platform: updatedService.platform,
        description: updatedService.description,
        averageTime: updatedService.averageTime,
        min: updatedService.min,
        max: updatedService.max,
        supplierCostInr: updatedService.supplier_cost_inr,
        supplierCostLkr: updatedService.supplier_cost_lkr,
        sellingPriceLkr: updatedService.selling_price_lkr,
        profitLkr: updatedService.profit_lkr,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update selling price',
      error: process.env.NODE_ENV === 'development' ? error.raw || error.message : undefined,
    });
  }
});

router.post('/order', userMiddleware, async (req, res) => {
  try {
    const { serviceId, link, quantity, couponCode, termsAccepted } = req.body;

    if (!serviceId || !String(serviceId).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please select a service',
      });
    }

    if (!validator.isURL(link || '', { require_protocol: true })) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid social media link including https://',
      });
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid quantity',
      });
    }

    if (termsAccepted !== true) {
      return res.status(400).json({
        success: false,
        message: 'Please accept the terms before creating an order',
      });
    }

    const services = await getResellerServices();
    const normalizedServices = Array.isArray(services) ? services.map(normalizeService) : [];
    const selectedService = normalizedServices.find((service) => service.serviceId === String(serviceId).trim());

    if (!selectedService) {
      return res.status(404).json({
        success: false,
        message: 'Selected service was not found',
      });
    }

    if (parsedQuantity < selectedService.min || parsedQuantity > selectedService.max) {
      return res.status(400).json({
        success: false,
        message: `Quantity must be between ${selectedService.min} and ${selectedService.max}`,
      });
    }

    const priceInr = Number(selectedService.cid_price_inr || 0);
    const priceLkr = Number(selectedService.price_lkr || 0);
    const totalLkr = Number(((parsedQuantity * priceLkr) / 1000).toFixed(2));
    const resellerCost = Number(((parsedQuantity * priceInr) / 1000).toFixed(4));
    const customerPrice = Number(totalLkr.toFixed(2));
    const availableWalletBalance = Number(req.user.walletBalance || 0);

    if (availableWalletBalance < customerPrice) {
      return res.status(400).json({
        success: false,
        message: `Not enough amount in wallet. Required LKR ${customerPrice.toLocaleString()}, available LKR ${availableWalletBalance.toLocaleString()}.`,
      });
    }

    req.user.walletBalance = Number((availableWalletBalance - customerPrice).toFixed(2));
    await req.user.save();

    const order = await Order.create({
      user: req.user._id,
      productName: selectedService.name,
      serviceName: selectedService.name,
      serviceId: selectedService.serviceId,
      cidServiceId: selectedService.cid_service_id,
      category: selectedService.category,
      platform: selectedService.platform,
      serviceType: selectedService.type,
      averageTime: selectedService.averageTime,
      link: link.trim(),
      quantity: parsedQuantity,
      price: customerPrice,
      customerPrice,
      priceInr,
      priceLkr,
      totalLkr,
      resellerCost,
      profit: Number((customerPrice - Number((resellerCost * inrToLkrRate).toFixed(2))).toFixed(2)),
      couponCode: (couponCode || '').trim(),
      termsAccepted: true,
      paymentStatus: 'Paid',
      orderStatus: 'Pending',
      currency: 'LKR',
      paidViaWallet: true,
      walletAmountDeducted: customerPrice,
      walletRefunded: false,
    });

    try {
      const cidResponse = await placeResellerOrder({
        service: order.cidServiceId,
        link: order.link,
        quantity: order.quantity,
      });

      const cidOrderId = getCidOrderId(cidResponse);

      if (!cidOrderId) {
        const error = new Error('CID API did not return an order ID');
        error.statusCode = 502;
        error.raw = cidResponse;
        throw error;
      }

      order.cidOrderId = cidOrderId;
      order.resellerOrderId = cidOrderId;
      order.orderStatus = 'Processing';
      order.apiError = '';
      await order.save();
    } catch (cidError) {
      req.user.walletBalance = Number((Number(req.user.walletBalance || 0) + customerPrice).toFixed(2));
      await req.user.save();

      order.paymentStatus = 'Refunded';
      order.orderStatus = 'Failed';
      order.walletRefunded = true;
      order.apiError = cidError.message || 'CID order submission failed';
      await order.save();

      return res.status(cidError.statusCode || 502).json({
        success: false,
        message: cidError.message || 'CID order submission failed. Wallet amount was refunded.',
        error: process.env.NODE_ENV === 'development' ? cidError.raw || cidError.message : undefined,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Social booster order submitted to CID successfully and the amount was deducted from your wallet.',
      data: {
        id: order._id,
        cid_service_id: order.cidServiceId,
        cid_order_id: order.cidOrderId,
        serviceName: order.serviceName,
        quantity: order.quantity,
        price_lkr: order.priceLkr,
        total_lkr: order.totalLkr,
        couponCode: order.couponCode,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        walletBalance: req.user.walletBalance,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create social booster order',
      error: process.env.NODE_ENV === 'development' ? error.raw || error.message : undefined,
    });
  }
});

router.get('/status/:orderId', userMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!order.cidOrderId) {
      return res.json({
        success: true,
        data: {
          id: order._id,
          serviceName: order.serviceName || order.productName,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          cid_service_id: order.cidServiceId,
          cid_order_id: '',
          charge: order.charge,
          startCount: order.startCount,
          remains: order.remains,
          source: 'local',
        },
      });
    }

    const resellerStatus = await getResellerOrderStatus(order.cidOrderId);
    const resellerStatusText = resellerStatus.status || order.orderStatus;

    order.orderStatus = resellerStatusText;
    order.charge = Number(resellerStatus.charge || order.charge || 0);
    order.startCount = Number(
      resellerStatus.start_count || resellerStatus.startCount || order.startCount || 0
    );
    order.remains = Number(resellerStatus.remains || order.remains || 0);
    await order.save();

    return res.json({
      success: true,
      data: {
        id: order._id,
        serviceName: order.serviceName || order.productName,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        cid_service_id: order.cidServiceId,
        cid_order_id: order.cidOrderId,
        charge: order.charge,
        startCount: order.startCount,
        remains: order.remains,
        source: 'reseller',
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch order status',
      error: process.env.NODE_ENV === 'development' ? error.raw || error.message : undefined,
    });
  }
});

router.get('/admin/balance', adminMiddleware, async (req, res) => {
  try {
    const balance = await getResellerBalance();
    return res.json({
      success: true,
      data: balance,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch reseller balance',
      error: process.env.NODE_ENV === 'development' ? error.raw || error.message : undefined,
    });
  }
});

router.post('/admin/order-status', adminMiddleware, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'orderId is required',
      });
    }

    const status = await getResellerOrderStatus(orderId);
    return res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch reseller order status',
      error: process.env.NODE_ENV === 'development' ? error.raw || error.message : undefined,
    });
  }
});

router.post('/admin/submit-order/:id', adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!order.cidServiceId) {
      return res.status(400).json({
        success: false,
        message: 'CID service ID is missing for this order',
      });
    }

    if (order.paymentStatus !== 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Mark payment as Paid before submitting to CID',
      });
    }

    if (order.cidOrderId) {
      return res.status(400).json({
        success: false,
        message: 'This order has already been submitted to CID',
      });
    }

    const cidResponse = await placeResellerOrder({
      service: order.cidServiceId,
      link: order.link,
      quantity: order.quantity,
    });

    const cidOrderId = getCidOrderId(cidResponse);

    if (!cidOrderId) {
      return res.status(502).json({
        success: false,
        message: 'CID API did not return an order ID',
        error: cidResponse,
      });
    }

    order.cidOrderId = cidOrderId;
    order.resellerOrderId = cidOrderId;
    order.orderStatus = 'Processing';
    order.apiError = '';
    await order.save();

    return res.json({
      success: true,
      message: 'Order submitted to CID successfully',
      data: {
        id: order._id,
        cid_service_id: order.cidServiceId,
        cid_order_id: order.cidOrderId,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to submit order to CID',
      error: process.env.NODE_ENV === 'development' ? error.raw || error.message : undefined,
    });
  }
});

router.post('/admin/place-order', adminMiddleware, async (req, res) => {
  try {
    const { service, link, quantity, runs, interval, comments, username, answer, posts, delay } = req.body;

    if (!service || !link || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'service, link, and quantity are required',
      });
    }

    const order = await placeResellerOrder({
      service,
      link,
      quantity,
      runs,
      interval,
      comments,
      username,
      answer,
      posts,
      delay,
    });

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to place reseller order',
      error: process.env.NODE_ENV === 'development' ? error.raw || error.message : undefined,
    });
  }
});

router.get('/my-orders', userMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    const ordersWithCid = orders.filter(o => o.cidOrderId);

    if (ordersWithCid.length > 0) {
      try {
        const orderIds = ordersWithCid.map(o => o.cidOrderId);
        const statusMap = await getResellerOrdersStatus(orderIds);

        for (const order of ordersWithCid) {
          const resellerData = statusMap[order.cidOrderId];
          if (resellerData && !resellerData.error) {
            order.orderStatus = resellerData.status || order.orderStatus;
            
            const remains = Number(resellerData.remains);
            if (Number.isFinite(remains)) order.remains = remains;

            const startCount = Number(resellerData.start_count ?? resellerData.startCount);
            if (Number.isFinite(startCount)) order.startCount = startCount;

            const charge = Number(resellerData.charge);
            if (Number.isFinite(charge)) order.charge = charge;

            order.refillAvailability = resellerData.refill !== undefined ? String(resellerData.refill) : '';
            order.apiError = '';
            await order.save();
          } else if (resellerData && resellerData.error) {
            order.apiError = resellerData.error;
            await order.save();
          }
        }
      } catch (syncError) {
        console.error('[Social Booster My Orders Sync] Mass status check failed:', syncError.message);
      }
    }

    const refreshedOrders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      orders: refreshedOrders.map(order => ({
        id: order._id,
        orderId: order.cidOrderId || String(order._id).slice(-8).toUpperCase(),
        localOrderId: String(order._id).slice(-8).toUpperCase(),
        productName: order.productName,
        serviceName: order.serviceName,
        cidServiceId: order.cidServiceId,
        category: order.category,
        platform: order.platform,
        quantity: order.quantity,
        link: order.link,
        price: order.price,
        customerPrice: order.customerPrice,
        priceLkr: order.priceLkr,
        totalLkr: order.totalLkr,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        cidOrderId: order.cidOrderId,
        charge: order.charge,
        startCount: order.startCount,
        remains: order.remains,
        refillId: order.refillId,
        refillStatus: order.refillStatus,
        refillAvailability: order.refillAvailability || '',
        createdAt: order.createdAt,
      }))
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch customer orders',
    });
  }
});

router.post('/order/:id/refill', userMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!order.cidOrderId) {
      return res.status(400).json({
        success: false,
        message: 'This order is not associated with a CID reseller service',
      });
    }

    let refillResponse;
    try {
      refillResponse = await requestResellerRefill(order.cidOrderId);
    } catch (apiError) {
      return res.status(400).json({
        success: false,
        message: apiError.message || 'Refill request failed',
      });
    }

    const refillId = refillResponse?.refill;

    if (!refillId) {
      return res.status(400).json({
        success: false,
        message: refillResponse?.error || 'CID Store did not return a refill ID',
      });
    }

    const refill = await Refill.create({
      user: req.user._id,
      order: order._id,
      refillId: String(refillId),
      cidOrderId: order.cidOrderId,
      link: order.link,
      serviceName: order.serviceName || order.productName,
      status: 'Pending',
    });

    order.refillId = String(refillId);
    order.refillStatus = 'Pending';
    await order.save();

    return res.status(201).json({
      success: true,
      message: 'Refill requested successfully',
      data: refill,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit refill request',
    });
  }
});

router.get('/refill-history', userMiddleware, async (req, res) => {
  try {
    const refills = await Refill.find({ user: req.user._id }).sort({ createdAt: -1 });
    const activeRefills = refills.filter(r => r.status === 'Pending' || r.status === 'InProgress' || r.status === 'Awaiting');

    if (activeRefills.length > 0) {
      try {
        const refillIds = activeRefills.map(r => r.refillId);
        const refillStatuses = await getResellerRefillsStatus(refillIds);

        if (Array.isArray(refillStatuses)) {
          for (const item of refillStatuses) {
            const refillDoc = activeRefills.find(r => r.refillId === String(item.refill));
            if (refillDoc && item.status) {
              refillDoc.status = item.status;
              await refillDoc.save();

              const orderDoc = await Order.findById(refillDoc.order);
              if (orderDoc && orderDoc.refillId === refillDoc.refillId) {
                orderDoc.refillStatus = item.status;
                await orderDoc.save();
              }
            }
          }
        }
      } catch (syncError) {
        console.error('[Social Booster Refill History Sync] Mass refill status failed:', syncError.message);
      }
    }

    const refreshedRefills = await Refill.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      refills: refreshedRefills,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch refill history',
    });
  }
});

module.exports = router;
