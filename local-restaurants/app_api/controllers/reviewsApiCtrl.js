const mongoose = require('mongoose');
const Loc = require('../models/location/locationApiSchema');
const User = require('../models/users');

// EXPOSED METHODS


function reviewsCreate(req, res) {
  getAuthor(req, res, (req, res, userName) => {
        const locationId = req.params.locationid;
        if (locationId) {
          Loc
            .findById(locationId)
            .select('reviews')
            .exec((err, location) => {
              if (err) {
                return res
                  .status(400)
                  .json(err);
              } else {
                doAddReview(req, res, location, userName);
                
              }
            });
        } else {
          res
            .status(404)
            .json({
                "message": "Location not found"});
              }
            });
      }


      function reviewsReadOne(req, res) {
        if (req.params && req.params.locationid && req.params.reviewid) {
          Loc
            .findById(req.params.locationid)
            .exec((err, location) => {
              if (!location) {
                res
                  .status(404)
                  .json({
                    "message": "locationid not found"
                  });
                return;
              } else if (err) {
                res
                  .status(404)
                  .json(err);
                return;
              }
              if (location.reviews && location.reviews.length > 0) {
                const review = location.reviews.id(req.params.reviewid);
                if (!review) {
                  res
                    .status(404)
                    .json({
                      "message": "reviewid not found"
                    });
                } else {
                  response = {
                    location: {
                      name: location.name,
                      id: req.params.locationid
                    },
                    review: review
                  };
                  res
                    .status(200)
                    .json(response);
                }
              } else {
                res
                  .status(404)
                  .json({
                    "message": "No reviews found"
                  });
              }
            });
        } else {
          res
            .status(404)
            .json({
              "message": "Not found, locationid and reviewid are both required"
            });
        }
      }

      function reviewsUpdateOne(req, res) {
        if (!req.params.locationid || !req.params.reviewid) {
          res
            .status(404)
            .json({
              "message": "Not found, locationid and reviewid are both required"
            });
          return;
        }
        Loc
          .findById(req.params.locationid)
          .select('reviews')
          .exec((err, location) => {
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
            if (location.reviews && location.reviews.length > 0) {
              let thisReview = location.reviews.id(req.params.reviewid);
              if (!thisReview) {
                res
                  .status(404)
                  .json({
                    "message": "reviewid not found"
                  });
              } else {
                thisReview.author = req.body.author;
                thisReview.rating = req.body.rating;
                thisReview.reviewText = req.body.reviewText;
                location.save((err, location) => {
                  if (err) {
                    res
                      .status(404)
                      .json(err);
                  } else {
                    _updateAverageRating(location._id);
                    res
                      .status(200)
                      .json(thisReview);
                  }
                });
              }
            } else {
              res
                .status(404)
              json({
                "message": "No review to update"
              });
            }
          });
      }

      function reviewsDeleteOne(req, res) {
        if (!req.params.locationid || !req.params.reviewid) {
          res
            .status(404)
            .json({
              "message": "Not found, locationid and reviewid are both required"
            });
          return;
        }
        Loc
          .findById(req.params.locationid)
          .select('reviews')
          .exec((err, location) => {
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
            if (location.reviews && location.reviews.length > 0) {
              if (!location.reviews.id(req.params.reviewid)) {
                res
                  .status(404)
                  .json({
                    "message": "reviewid not found"
                  });
              } else {
                location.reviews.id(req.params.reviewid).remove();
                location.save((err) => {
                  if (err) {
                    res
                      .status(404)
                      .json(err);
                  } else {
                    updateAverageRating(location._id);
                    res
                      .status(204)
                      .json(null);
                  }
                });
              }
            } else {
              res
                .status(404)
                .json({
                  "message": "No review to delete"
                });
            }
          });
      }

      // PRIVATE HELPER METHODS

      function _doAddReview(req, res, location, author) {
        if (!location) {
          res
            .status(404)
            .json({
              "message": "locationid not found"
            });
        } else {
          location.reviews.push({
            author: author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
          });
          location.save((err, location) => {
            if (err) {
              console.log(err);
              res
                .status(400)
                .json(err);
            } else {
              _updateAverageRating(location.id);
              let thisReview = location.reviews[location.reviews.length - 1];
              res
                .status(201)
                .json(thisReview);
            }
          });
        }
      }

    function doAddReview (req, res, location, author)  {
        if (!location) {
          res
            .status(404)
            .json({"message": "Location not found"});
        } else {
          const {rating, reviewText} = req.body;
          location.reviews.push({
            author,
            rating,
            reviewText
          });
          location.save((err, location) => {
            if (err) {
              return res
                .status(400)
                .json(err);
            } else {
              updateAverageRating(location._id);
              const thisReview = location.reviews.slice(-1).pop();
              res
                .status(201)
                .json(thisReview);
            }
          });
        }
      };

      function _updateAverageRating(locationid) {
        Loc
          .findById(locationid)
          .select('rating reviews')
          .exec((err, location) => {
            if (!err) {
              _doSetAverageRating(location);
            }
          });
      }

      function _doSetAverageRating(location) {
        if (location.reviews && location.reviews.length > 0) {
          const reviewCount = location.reviews.length;
          let ratingTotal = 0;
          for (let i = 0; i < reviewCount; i++) {
            ratingTotal = ratingTotal + location.reviews[i].rating;
          }
          let ratingAverage = parseInt(ratingTotal / reviewCount, 10);
          location.rating = ratingAverage;
          location.save((err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Average rating updated to", ratingAverage);
            }
          });
        }
      }

      function getAuthor(req, res, callback)  {
        if (req.payload && req.payload.email) {
          User
            .findOne({ email : req.payload.email })
            .exec((err, user) => {
              if (!user) {
                return res
                  .status(404)
                  .json({"message": "User not found"});
              } else if (err) {
                console.log(err);
                return res
                  .status(404)
                  .json(err);
              }
              callback(req, res, user.name);
            });
        } else {
          return res
            .status(404)
            .json({"message": "User not found"});
        }
      }

      module.exports = {
        reviewsCreate,
        reviewsReadOne,
        reviewsUpdateOne,
        reviewsDeleteOne
      };