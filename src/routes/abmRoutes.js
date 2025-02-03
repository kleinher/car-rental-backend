const express = require('express');
const abmRouter = express.Router();
const { createNew } = require('../controllers/GenericController');

abmRouter.post('/create/end', (req, res) => createNew(req, res));
module.exports = abmRouter;