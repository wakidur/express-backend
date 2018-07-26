//dependencies
var express = require('express');
var router = express.Router();

var ApplicationModel = require('../models/applicationModel');

var ModelContainer = require('../models/moduleServiceModel');
var ModuleModel = ModelContainer[2];

var FieldServiceModel = require('../models/fieldServiceModel');

// save or update application data 
var saveOrUpdateApplication = function (req, res) {
    //console.log("enter save or update method");

    if (!req.body._id) {  // insert data 
        var applicationObj = new ApplicationModel({
            name: req.body.name,
            shortName: req.body.shortName,
        });

        // save data into database 
        applicationObj.save(function (err) {
            if (err) {
                //console.log('Error while saving fieldService: ' + err);
                return res.send({ error: err });
            } else {
                console.log("page section create ");
                return res.send({ status: 'OK', data: applicationObj });
            }
        });
    } else {  // udpate data 
        return ApplicationModel.findById(req.body._id, function (err, applicationEntity) {

            if (!applicationEntity) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            if (req.body.name != null) applicationEntity.name = req.body.name;
            if (req.body.shortName != null) applicationEntity.shortName = req.body.shortName;

           // console.log("after customise" + applicationEntity);

            return applicationEntity.save(function (err) {
                if (!err) {
                    // console.log('Updated');
                    return res.send({ status: 'OK', data: applicationEntity });
                } else {
                    if (err.name == 'ValidationError') {
                        res.statusCode = 400;
                        res.send({ error: 'Validation error' });
                    } else {
                        res.statusCode = 500;
                        res.send({ error: 'Server error' });
                    }
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                }

                res.send(fieldServiceData);

            });
        });
    }
};



// get section page list 
var getApplication = function (req, res) {

    ApplicationModel.find()
        .sort({ typeId: 1, alphabet: 1, code: 1 })
        .exec(function(err, data) {
            if (err) { return next(err); }
            //Successful, so render
            res.send(data);
        });
};

// delete page section 
var deleteApplicaiton = function (req, res) {

    return ModuleModel.findOne({ applicationId: req.body._id }, function (err, module) {
        if (err) {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        } else {
            if (!module) {
                return FieldServiceModel.findOne({ applicationId: req.body._id }, function (err, field) {
                    if (err) {
                        res.statusCode = 500;
                        console.log('Internal error(%d): %s', res.statusCode, err.message);
                        return res.send({ error: 'Server error' });
                    } else {
                        if (!field) {
                            return ApplicationModel.findById(req.body._id, function (err, app) {
                                if (!app) {
                                    res.statusCode = 404;
                                    return res.send({ error: 'Not found' });
                                }
                                return app.remove(function (err) {
                                    if (!err) {
                                        console.log('Removed application ');
                                        return res.send({ status: 'OK', isExist: false });
                                    } else {
                                        res.statusCode = 500;
                                        console.log('Internal error(%d): %s', res.statusCode, err.message);
                                        return res.send({ error: 'Server error' });
                                    }
                                });
                            });
                        } else {
                            return res.send({ status: 'OK', isExist: true });
                        }
                    }
                });
            } else {
                return res.send({ status: 'OK', isExist: true });
            }
        }
    });
};

// check used application in module schema 
function _isUsedModuleSchema(req, res) {
    return ModuleModel.findOne({ applicationId: req.body._id }, function (err, module) {
        if (err) {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
        console.log("return module " + module);

    });
};

// check used application into field Schema 
function _isUsedFieldSchema(req, res) {
    return FieldServiceModel.findOne({ applicationId: req.body._id }, function (err, field) {
        if (err) {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }

        console.log("return field " + field);

    });
}

//calling api based method
router.post('/saveChanges', saveOrUpdateApplication);
router.get('/getApplication', getApplication);
router.post('/Delete', deleteApplicaiton);



module.exports = router;