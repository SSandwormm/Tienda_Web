const { users } = require('../data/userData');

const orders = [];

function createOrder(userId, payload) {
  const order = {
    id: `order_${Date.now()}`,
    userId,
    items: payload.items || [],
    total: payload.total || 0,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  orders.push(order);

  const user = users.find((entry) => entry.id === userId);
  if (user) {
    user.orders.push(order);
  }

  return order;
}

module.exports = { createOrder };