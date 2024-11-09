const express = require('express');
const router = express.Router();
const tripController = require('../../controllers/api/tripController');


router.route('/')
.get(tripController.getAllTrips)
.post(tripController.createTrip)
.put(tripController.updateTrip)
.delete(tripController.deleteTrip)

router.route('/:id')
.get(tripController.getTrip)


router.route('/')
module.exports = router;