const express = require("express");
const {
  listProducts,
  listFutureProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { requireSupabaseAdmin } = require("../middleware/supabaseAdmin");

const router = express.Router();
router.get("/", listProducts);
router.get("/future", listFutureProducts);
router.post("/", requireSupabaseAdmin, createProduct);
router.get("/:slug", getProduct);
router.put("/:id", requireSupabaseAdmin, updateProduct);
router.delete("/:id", requireSupabaseAdmin, deleteProduct);

module.exports = router;
