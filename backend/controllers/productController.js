import Product from '../models/Product.js';

// Get all products (public)
export const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;

    let filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .populate('addedBy', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('addedBy', 'username email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

// Create product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, specifications, features } = req.body;

    // Validation
    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, and price',
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative',
      });
    }

    const product = new Product({
      name,
      description,
      category: category || 'account',
      price,
      stock: stock || 0,
      specifications,
      features: features || [],
      addedBy: req.user.userId,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

// Update product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow updating addedBy
    delete updates.addedBy;

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('addedBy', 'username email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      deletedProduct: product,
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
