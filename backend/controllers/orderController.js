import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create order
export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, paymentMethod, deliveryAddress, notes } = req.body;

    // Validation
    if (!productId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID and payment method',
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.stock}`,
      });
    }

    const totalPrice = product.price * quantity;

    const order = new Order({
      user: req.user.userId,
      product: productId,
      quantity: quantity || 1,
      totalPrice,
      paymentMethod,
      deliveryAddress: deliveryAddress || {},
      notes,
    });

    await order.save();

    // Reduce product stock
    product.stock -= quantity;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('product', 'name price image')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product')
      .populate('user', 'username email phoneNumber');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user is authorized
    if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    const orders = await Order.find(filter)
      .populate('product', 'name price')
      .populate('user', 'username email phoneNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus, adminNotes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (status) {
      order.status = status;
      if (status === 'completed') {
        order.completedAt = new Date();
      } else if (status === 'cancelled') {
        order.cancelledAt = new Date();

        // Restore product stock
        const product = await Product.findById(order.product);
        if (product) {
          product.stock += order.quantity;
          await product.save();
        }
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (adminNotes) {
      order.adminNotes = adminNotes;
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message,
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization
    if (order.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending orders can be cancelled',
      });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();

    // Restore product stock
    const product = await Product.findById(order.product);
    if (product) {
      product.stock += order.quantity;
      await product.save();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message,
    });
  }
};

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
