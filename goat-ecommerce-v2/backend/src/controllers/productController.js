const productService = require("../services/productsDb");

async function listProducts(req, res, next) {
  try {
    const category = req.query.category;
    const products = await productService.list({ category });
    res.json({ products });
  } catch (error) {
    next(error);
  }
}

async function listFutureProducts(req, res, next) {
  try {
    const products = await productService.list({
      includeFuture: true,
      futureOnly: true,
    });
    res.json({ products });
  } catch (error) {
    next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const { slug } = req.params;
    const product = await productService.getBySlug(slug);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ product });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const payload = req.body || {};
    const product = await productService.create(payload);
    res.status(201).json({ product, message: "Producto creado correctamente" });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productService.update(id, req.body || {});

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ product, message: "Producto actualizado correctamente" });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const removed = await productService.remove(id);

    if (!removed) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente", id });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
  listFutureProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
