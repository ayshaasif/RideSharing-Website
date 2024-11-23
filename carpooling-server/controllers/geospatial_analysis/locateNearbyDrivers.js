const KMeans = require('ml-kmeans');
const { getDistance } = require('geolib');
const Trip = require('../../models/Trip')
const Booking = require('../../models/Booking');
const axios = require('axios');
const { setDriver } = require('mongoose');

// const clusterThePickupPoints = async(req,res)=>{
//     const {}
// }
const getClosestCluster = (centroids, location) => {
    let closestCluster = -1;
    let minDistance = Infinity;

    centroids.forEach((centroid, index) => {
        const distance = getDistance(
            { latitude: centroid[0], longitude: centroid[1] },
            location
        );
        if (distance < minDistance) {
            minDistance = distance;
            closestCluster = index;
        }
    });

    return closestCluster;
};

const locateNearbyDrivers = async(req, res) => {
    const { start_location , end_location } = req.body;
    // const passengerLocation = { latitude, longitude };
    start_point_long = start_location[0]
    start_point_lat =  start_location[1]
    end_point_long = end_location[0]
     end_point_lat =  end_location[1]
    console.log(start_location, start_location);
    // // Step 1: Prepare driver coordinates for clustering
    const driversWithSameDestination = await Trip.find().lean();//filter(trip => driver.destination === destination);
    console.log(driversWithSameDestination);
    // let locateNearbyDrivers = (await Trip.find()).map((trip) => ({
    //     trip_id: trip._id,
    //     driver : trip.driver_id,
    //     drive_loc : [trip.start_location , trip.end_location]
    // }) )
    // const driverCoords = drivers.map(driver => driver.drive_loc);

    // // Step 2: Perform k-means clustering on driver locations
    // const numberOfClusters = 2;
    // const kmeansResult = KMeans(driverCoords, numberOfClusters);

    // // Step 3: Find the closest cluster to the passenger's location
    // const passengerCluster = getClosestCluster(kmeansResult.centroids, passengerLocation);

    // // Step 4: Filter drivers within the same cluster
    // const driversInCluster = kmeansResult.clusters
    //     .map((cluster, index) => ({ id: drivers[index].id, cluster }))
    //     .filter(driver => driver.cluster === passengerCluster)
    //     .map(driver => drivers.find(d => d.id === driver.id));

    // // Step 5: Filter drivers within a specific distance (e.g., 5 km)
    // const maxDistance = 5000; // 5 km
    // const nearbyDrivers = driversInCluster.filter(driver => {
    //     const distance = getDistance(
    //         { latitude: driver.latitude, longitude: driver.longitude },
    //         passengerLocation
    //     );
    //     return distance <= maxDistance;
    // });

    // res.json(nearbyDrivers);
    // res.json({"longitude":24.821248935505945, "latitude":56.07928376644849});
    res.status(201).json(driversWithSameDestination);

}

module.exports = {locateNearbyDrivers};