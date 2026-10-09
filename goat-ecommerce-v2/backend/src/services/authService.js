const bcrypt = require("bcryptjs");
const tokenService = require("./tokenService");
const { users } = require("../data/userData");

function login({ email, password }) {
  const user = users.find((entry) => entry.email === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    const error = new Error("Credenciales incorrectas");
    error.status = 401;
    throw error;
  }

  const token = tokenService.signToken({ sub: user.id });
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
}

function register({ name, email, password }) {
  const exists = users.find((entry) => entry.email === email);
  if (exists) {
    const error = new Error("El correo ya esta registrado");
    error.status = 400;
    throw error;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    passwordHash,
    role: "admin",
    createdAt: new Date().toISOString(),
    orders: [],
  };
  users.push(newUser);
  const token = tokenService.signToken({ sub: newUser.id });
  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    token,
  };
}

function getUserById(id) {
  return users.find((entry) => entry.id === id);
}

module.exports = { login, register, getUserById };
