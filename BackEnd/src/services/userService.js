// src/services/userService.js
const userRepository = require('../repositories/userRepository');

module.exports = {
  async getAllUsers() {
    return await userRepository.getAllUsers();
  },
};
