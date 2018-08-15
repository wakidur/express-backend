const mongoose = require('mongoose');
require('../models/locationSchema');
var geoLoation = require('../models/loc');
var Loc = mongoose.model('location');


const _buildLocationList = function (results) {
  let locations = [];
  results.forEach((doc) => {
    locations.push({
      distance: doc.dis,
      name: doc.name,
      address: doc.address,
      rating: doc.rating,
      facilities: doc.facilities,
      _id: doc._id
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
  Loc.aggregate([{
    "$geoNear": {
      "near": {
        "type": "Point",
        "coordinates": [lat, lng]
      },
      "distanceField": "dis",
      "spherical": true,
      "maxDistance": 500
    }
  }]).then((results) => {
    const locations = _buildLocationList(results);
    console.log('Geo Results', results);
    console.log('Geo stats');
    res
      .status(200)
      .json(locations);
  }).catch((err) => {
    return next(err);
  });
}

// Create location



module.exports = {
  locationsListByDistance
};