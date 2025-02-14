const express = require('express');
const GoogleMapsRouter = express.Router();
const GoogleMapsApiController = require('../controllers/GoogleMapsApiController');


GoogleMapsRouter.get('/', (req, res) => GoogleMapsApiController.getPlaces(req, res));

module.exports = GoogleMapsRouter;