const Product = require('../models/Product')

const createProduct = async (req, res) => {
  try {
    const { name, sku, barcode, categoryId, unitCost, alertDaysBeforeExpiry } = req.body

    const skuExists = await Product.findOne({ sku })
    if (skuExists) {
      return res.status(400).json({ message: 'SKU já cadastrado.' })
    }

    const product = await Product.create({
      name, sku, barcode, categoryId, unitCost,
      alertDaysBeforeExpiry,
      createdBy: req.user._id
    })

    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('categoryId', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name')
      .populate('createdBy', 'name email')

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' })
    }

    res.json({ message: 'Produto removido com sucesso.' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct }