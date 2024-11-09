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
    const { latitude, longitude } = req.params;
    const passengerLocation = { latitude, longitude };

    // Step 1: Prepare driver coordinates for clustering
    const driversWithSameDestination = drivers.filter(driver => driver.destination === destination);

    let locateNearbyDrivers = (await Trip.find()).map((trip) => ({
        trip_id: trip._id,
        driver : trip.driver_id,
        drive_loc : [trip.start_location , trip.end_location]
    }) )
    const driverCoords = drivers.map(driver => driver.drive_loc);

    // Step 2: Perform k-means clustering on driver locations
    const numberOfClusters = 2;
    const kmeansResult = KMeans(driverCoords, numberOfClusters);

    // Step 3: Find the closest cluster to the passenger's location
    const passengerCluster = getClosestCluster(kmeansResult.centroids, passengerLocation);

    // Step 4: Filter drivers within the same cluster
    const driversInCluster = kmeansResult.clusters
        .map((cluster, index) => ({ id: drivers[index].id, cluster }))
        .filter(driver => driver.cluster === passengerCluster)
        .map(driver => drivers.find(d => d.id === driver.id));

    // Step 5: Filter drivers within a specific distance (e.g., 5 km)
    const maxDistance = 5000; // 5 km
    const nearbyDrivers = driversInCluster.filter(driver => {
        const distance = getDistance(
            { latitude: driver.latitude, longitude: driver.longitude },
            passengerLocation
        );
        return distance <= maxDistance;
    });

    res.json(nearbyDrivers);
}

module.exports = {locateNearbyDrivers};