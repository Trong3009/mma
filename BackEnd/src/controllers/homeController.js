// src/controllers/homeController.js
const userService = require('../services/userService');

module.exports = {
  async index(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.render('index', { users });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error loading users');
    }
  },
};
