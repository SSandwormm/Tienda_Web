const orderService = require('../services/orderService');

async function createOrder(req, res, next) {
  try {
    const order = orderService.createOrder(req.user.id, req.body);
    res.status(201).json({ order, message: 'Pedido generado correctamente' });
  } catch (error) {
    next(error);
  }
}

module.exports = { createOrder };