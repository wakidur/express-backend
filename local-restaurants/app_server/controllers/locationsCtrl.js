/* GET 'home' page */
const request = require('request');
const apiOptions = {
  server: 'http://localhost:3300'
}
if (process.env.NODE_ENV === 'productionc') {
  console.log(process.env.NODE_ENV);
}

// Public exposed methods

/**
 * GET 'home' page 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
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
      maxDistance: 1000
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
  const lng = req.params.lng;
  const lat = req.params.lat; 
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(requestOptions, (err, response, responseData) => {
    let data = responseData
    if (err) {
      return next(err);
    } else {
      if(response.statusCode === 200){

        
        // data.coords = {
        //   lng: responseData.coords[0],
        //   lat: responseData.coords[1]
        // };
        _renderDetailPage(req, res, data); 
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  });
}
/**
 * GET 'Location info' page
 */



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
  locationInfo
};