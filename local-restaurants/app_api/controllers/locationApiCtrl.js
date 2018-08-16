const mongoose = require('mongoose');
var Loc = require('../models/location/locationApiSchema');



// GET location list by Distance
function locationsListByDistance(req, res, next) {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const maxDistance = parseFloat(req.query.maxDistance);
  const point = {
    "type": "Point",
    "coordinates": [lng, lat]
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
      "distanceField": "dist",
      "spherical": true,
      "maxDistance": maxDistance,
      "includeLocs": "location",
      "num": 10
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

// Create Location 
function locationsCreate(req, res) {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days,
      opening: req.body.opening,
      closing: req.body.closing,
      closed: req.body.closed,
    }]
  }, (err, location) => {
    if (err) {
      res
        .status(400)
        .json(err);
    } else {
      res
        .status(201)
        .json(location);
    }
  });
}

// Get Location by id
function locationsReadOne(req, res) {
  if (req.params && req.params.locationid) {
    Loc.find().exec((err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });
    var options = {
      near: [10, 10],
      maxDistance: 5
    };
    Loc.geoSearch({
      type: "house"
    }, options, function (err, res) {
      console.log(res);
    });
    Loc.findById(req.params.locationid).then((location) => {
      if (!location) {
        res.status(404).json({
          "message": "locationid not found"
        });
        return;
      } else {
        res.status(200).json(location);
      }
    }).catch((err) => {
      res
        .status(404)
        .json(err);
    });


  } else {
    res
      .status(404)
      .json({
        "message": "No locationid in request"
      });
  }
}
// PRIVATE METHODS
function _buildLocationList(results) {
  let locations = [];
  results.forEach((doc) => {
    locations.push({
      distance: doc.dist,
      name: doc.name,
      address: doc.address,
      rating: doc.rating,
      facilities: doc.facilities,
      _id: doc._id
    });
  });
  return locations;
}

// Method exports
module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne
};