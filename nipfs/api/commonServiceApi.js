//dependencies
var express = require('express');
var router = express.Router();

var ApplicationModel = require('../models/applicationModel.js');
var ModuleEntryModel = require('../models/moduleEntryModel.js');

// get section page list 
var GetAppData = function (req, res) {

    return ApplicationModel.find(function (err, data) {
        if (!err) {
            return res.send(data);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    }).sort({ typeId: 1, alphabet: 1, code: 1 });
};


var GetModuleData = function (req, res) {

    return ModuleEntryModel.find(function (err, data) {
        if (!err) {
            return res.send(data);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    }).sort({ typeId: 1, alphabet: 1, code: 1 });
};


//calling api based method
router.get('/GetAppData', GetAppData);
router.get('/GetModuleData', GetModuleData);

module.exports = router;