const routesUsers = require('express').Router();
const { getUsers, getUserById, createUser, updateProfile, updateAvatar } = require('../controllers/users');

routesUsers.get('/users', getUsers);

routesUsers.get('/users/:userId', getUserById);

routesUsers.post('/users', createUser);

routesUsers.patch('/users/me', updateProfile);

routesUsers.patch('/users/me/avatar', updateAvatar);

module.exports = routesUsers;