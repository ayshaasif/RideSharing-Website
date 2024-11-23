const express = require('express');
const router = express.Router();
const tripController = require('../../controllers/api/tripController');
const locateTripController = require('../../controllers/geospatial_analysis/locateNearbyDrivers');

router.route('/')
.get(tripController.getAllTrips)
.post(tripController.createTrip)
.put(tripController.updateTrip)
.delete(tripController.deleteTrip)

router.route('/:id')
.get(tripController.getTrip)


router.route('/locate')
.post(locateTripController.locateNearbyDrivers)


module.exports = router;