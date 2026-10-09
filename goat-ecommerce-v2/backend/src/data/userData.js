const bcrypt = require("bcryptjs");

const users = [
  {
    id: "user_demo",
    name: "Goat Demo",
    email: "demo@goat.com",
    passwordHash: bcrypt.hashSync("Demo1234", 10),
    role: "admin",
    createdAt: new Date().toISOString(),
    orders: [],
  },
];

module.exports = { users };
