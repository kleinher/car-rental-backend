const express = require('express');
const mechanicRouter = express.Router();
const { createMechanic, deleteMechanic, getMechanicById, getMechanics, updateMechanic } = require('../controllers/MechanicsController');

mechanicRouter.get('/', (req, res) => getMechanics(req, res));
mechanicRouter.get('/:id', (req, res) => getMechanicById(req, res));
mechanicRouter.post('/', (req, res) => createMechanic(req, res));
mechanicRouter.put('/:id', (req, res) => updateMechanic(req, res));
mechanicRouter.delete('/:id', (req, res) => deleteMechanic(req, res));

module.exports = mechanicRouter;
