const mongoose = require('mongoose');
const _ = require('lodash');
const Loc = require('../models/location/locationApiSchema');



// GET location list by Distance
function locationsListByDistance(req, res, next) {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const maxDistance = parseFloat(req.query.maxDistance);
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
  let locationid  = req.params.locationid;
  if (req.params && req.params.locationid) {
    Loc.aggregate([{
      "$geoNear": {
        "near": {
          "type": "Point",
          "coordinates": [90.403712, 23.789182]
        },
        "distanceField": "dist",
        "spherical": true,
        "maxDistance": 10000,
        "includeLocs": "location",
        "num": 10
      }
    }]).then((location) => {
      if (!location) {
        res.status(404).json({
          "message": "locationid not found"
        });
        return;
      } else {
        const matchesid = _.filter(location, _.matches({
          '_id': locationid
        }));
        //console.log(resultsmatch);
        let data = matchesid[0];
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
// location update 
function locationsUpdateOne(req, res) {
  if (!req.params.locationid) {
    res
      .status(404)
      .json({
        "message": "Not found, locationid is required"
      });
    return;
  } else {
    Loc.findById(req.params.locationid).select('-reviews -rating').exec((err, location) => {
      if (!location) {
        res
          .status(404)
          .json({
            "message": "locationid not found"
          });
        return;
      } else if (err) {
        res
          .status(400)
          .json(err);
        return;
      }

      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(",");
      location.coords = [parseFloat(req.body.lat), parseFloat(req.body.lng)];
      location.openingTimes = [{
        days: req.body.days,
        opening: req.body.opening,
        closing: req.body.closing,
        closed: req.body.closed
      }];
      location.save((err, location) => {
        if (err) {
          res
            .status(404)
            .json(err);
        } else {
          res
            .status(200)
            .json(location);
        }
      });
    });
  }
}

// Location Delete One
function locationsDeleteOne(req, res) {
  const locationid = req.params.locationid;
  if (locationid) {
    Loc.findByIdAndRemove(locationid).exec((err, location) => {
      if (err) {
        res
          .status(404)
          .json(err);
        return;
      } else {
        res
          .status(204)
          .json(null);
      }
    });
  } else {
    res
      .status(404)
      .json({
        "message": "No locationid"
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
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne

};