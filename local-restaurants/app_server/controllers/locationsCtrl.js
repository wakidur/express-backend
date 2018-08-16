/* GET 'home' page */
const request = require('request');
const _ = require('lodash');
const Loc = require('../../app_api/models/location/locationApiSchema');
const apiOptions = {
  server: 'http://localhost:3300'
};




// Public exposed methods
function locationCreateGet(req, res) {
  res.render('./locations/location-entre-form' , {
    title: `Location Entry for`
  });
}
function locationCreatePost(req, res) {
  var closeflag = req.body.closed === "closed" ? true : false;
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    rating: req.body.rating,
    facilities: req.body.facilities.split(","),
    coords: [parseFloat(req.body.lat), parseFloat(req.body.lng)],
    openingTimes: [{
      days: req.body.days,
      opening: req.body.opening,
      closing: req.body.closing,
      closed: closeflag,
    }]
  }, (err, location) => {
    if (err) {
      res
        .status(400)
        .json(err);
    } else {
      console.log(location);
      res
        .status(201)
        .json({"message": "Success"});
        // res.redirect('/location/new');
    }
  });
  


  
  
}
/**
 * GET 'home' page 
 */

function homeList(req, res, next) {
  const path = '/api/locations';
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {
      lng: 23.789182,
      lat: 90.403712,
      maxDistance: 10000
    }
  };
  request(requestOptions, (err, response, resData) => {
    let data = resData;
    if (err) {
      return next(err);
    } else {
      if (response.statusCode === 200 && data.length) {
        data.forEach(element => {
          element.distance =  _formatDistance(element.distance);
        });
      }
      _renderHomepage(req, res, data);
    }
  });
}

/* GET 'Location info' page */
function locationInfo(req, res, next) {
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(requestOptions, (err, response, responseData) => {

    const matchesid =  _.filter(responseData, _.matches({ '_id': req.params.locationid}));
    //console.log(resultsmatch);
    let data = matchesid[0];
    if (err) {
      return next(err);
    } else {
      if(response.statusCode === 200){
        _renderDetailPage(req, res, data); 
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  });
}

/**
 * Get add review page
 */
function addReview(req, res) {
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(requestOptions, (err, response, body) => {
    let data = body;
    if (response.statusCode === 200) {
      _renderReviewForm(req, res, responseData);
    } else {
      _showError(req, res, response.statusCode);
    }
  })
}

function doAddReview(req, res) {
  
}


// PRIVATE METHODS

// Render Homepage
function _renderHomepage(req, res, responseBody) {
  let message = [];
  if (!(responseBody instanceof Array)) {
    message = 'API lookup error';
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = 'No places found nearby';
    }
  }
  res.render('./locations/locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
    locations: responseBody,
    message: message
  });
}

function _renderDetailPage(req, res, locDetail) {
  res.render('./locations/location-info', {
    title: locDetail.name,
    pageHeader: {
      title: locDetail.name
    },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: locDetail
  });
}

function _isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function _formatDistance(distance) {
  if (distance && _isNumeric(distance)) {
    let thisDistance = 0;
    let unit = 'm';
    if (distance > 1000) {
      thisDistance = parseFloat(distance / 1000).toFixed(1);
      unit = 'km';
    } else {
      thisDistance = Math.floor(distance);
    }
    return thisDistance + unit;
  } else {
    return '?';
  }
}

function _renderReviewForm(req, res, locDetail) {
  res.render('./locations/location-review-form', {
    title: `Review ${locDetail.name}`,
    pageHeader: {title: `Review ${locDetail.name}`},
    error: req.query.err
  });
}

function _showError(req, res, status) {
  let title = '';
  let content = '';
  if (status === 404) {
    title = "404 page not found";
    content = `Oh dear. Looks like we can\t find this page. Sorry.`;
  } else {
    title = `${status}, something's gone wrong`;
    content = `Something, somewhere, has gone just a little bit wrong.`;
  }
  res.status(status);
  res.render('/about/about', {
    title: title,
    content: content
  });
}


module.exports = {
  homeList,
  locationInfo,
  locationCreateGet,
  locationCreatePost,
  addReview,
  doAddReview
};