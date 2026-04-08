// In-memory array for Phase 1 Database
let users = [];

const getUsers = () => users;
const addUser = (user) => users.push(user);
const findUserByEmail = (email) => users.find(u => u.email === email);
const updateUser = (email, updates) => {
  const index = users.findIndex(u => u.email === email);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return users[index];
  }
  return null;
};
const findUserById = (id) => users.find(u => u.id === id);

module.exports = {
  getUsers,
  addUser,
  findUserByEmail,
  updateUser,
  findUserById
};
