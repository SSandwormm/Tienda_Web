const express = require("express");
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");
const scrollRoutes = require("./scrollRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/scroll-images", scrollRoutes);

module.exports = router;
