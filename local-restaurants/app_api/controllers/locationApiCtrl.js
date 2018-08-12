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
  Location.find().then((locations) => {
    res
      .status(200)
      .json(locations);
  }).catch((err) => {
    return next(err);
  });
}



module.exports = {
  locationsListByDistance
};