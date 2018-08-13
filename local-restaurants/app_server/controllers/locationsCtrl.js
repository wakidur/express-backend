/* GET 'home' page */
const request = require('request');
const apiOptions = {
  server: 'http://localhost:3300/'
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
  const path = 'api/locations';
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'GET',
    json : {},
    qs : {
      lng : -0.7992599,
      lat : 51.378091,
      maxDistance : 20
    }
  };
  request(
    requestOptions,
    (err, response, body) => {
      let data = body;
      if (response.statusCode === 200 && data.length) {
        for (let i = 0; i < data.length; i++) {
          data[i].distance = _formatDistance(data[i].distance);
        }
      }
      _renderHomepage(req, res, data);
    }
  );
}

/**
 * GET 'Location info' page
 */

function locationInfo(req, res) {
  _getLocationInfo(req, res, () => {
    console.log(responseData);
    _renderDetailPage(req, res, responseData)
  });
}
// PRIVATE METHODS

function _getLocationInfo(req, res, callback) {
  const path = `api/locations/${req.params.locationid}`;
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {}
  };

  request(requestOptions, (err, response, body))
  
}

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

module.exports = {
  homeList,
  locationInfo

};