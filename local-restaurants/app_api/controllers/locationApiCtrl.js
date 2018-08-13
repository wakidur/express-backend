const mongoose = require('mongoose');
const Location = require('../models/location/locationApiSchema');

const _buildLocationList = function (req, res, results, stats) {
  let locations = [];
  results.forEach((doc) => {
    locations.push({
      distance: doc.dis,
      name: doc.obj.name,
      address: doc.obj.address,
      rating: doc.obj.rating,
      facilities: doc.obj.facilities,
      _id: doc.obj._id
    });
  });
  return locations;
};

function locationsListByDistance(req, res, next) {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const maxDistance = parseFloat(req.query.maxDistance);
  const point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  const geoOptions = {
    spherical: true,
    maxDistance: 20000,
    num: 10
  };
  if ((!lng && lng !== 0) || (!lat && lat !== 0) || !maxDistance) {
    console.log('locationsListByDistance missing params');
    res
      .status(404)
      .json({
        message: 'lng, lat and maxDistance query parameters are all required'
      });
    return;
  }
  Location.find().then((results) => {
      res
        .status(200)
        .json(results);
    }).catch((err) => {
      return next(err);
    });
}

/* GET 'Location info' page */


module.exports = {
  locationsListByDistance,
  locationInfo
};