
//dependencies
var express = require('express');
var router = express.Router();

// field specification model 
var ModuleEntryModel = require('../models/moduleEntryModel.js');
var FieldServiceModel = require('../models/fieldServiceModel.js');
var FieldSpecsModel = require('../models/fieldSpecsModal.js');  // field specification model 


// check _id is used to another scope(another page is used this entity)
var isExist = false;


// get module list 
function GetModuleData(req, res) {
    return ModuleEntryModel.find(function (err, data) {
        console.log("get data ");
        if (!err) {
            return res.send(data);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    }).sort({ name: 1 });
}

// save or update section service data 
var saveOrUpdateModule = function (req, res) {

    if (!req.body._id) {  // insert data 
        var moduleObj = new ModuleEntryModel({
            name: req.body.name,
            code: req.body.code,
            applicationId: req.body.applicationId,
        });

        // save data into database 
        moduleObj.save(function (err) {
            if (err) {
                return res.send({ error: err });
            } else {
                console.log("page section create ");
                return res.send({ status: 'OK', data: moduleObj });
            }
        });
    } else {  // udpate data 
        return ModuleEntryModel.findById(req.body._id, function (err, moduleEntity) {

            if (!moduleEntity) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            if (req.body.name != null) moduleEntity.name = req.body.name;
            if (req.body.code != null) moduleEntity.code = req.body.code;
            if (req.body.applicationId != null) moduleEntity.applicationId = req.body.applicationId;

            return moduleEntity.save(function (err) {
                if (!err) {
                    // console.log('Updated');
                    return res.send({ status: 'OK', data: moduleEntity });
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


// delete module data with page list 
var deleteModule = function (req, res) {
    // this item is used in another scope 
    isExist = false;

    return FieldSpecsModel.find({ moduleId: req.body._id }, function (err, fieldSec) {

        for (var i = 0; i < fieldSec.length; i++) {
            if (fieldSec[i].moduleId) {
                isExist = true;
                break;
            }
        }
        if (isExist) {
            console.log("check ===== ");
            return res.send({ status: 'OK', isExist: isExist });
        } else {
            return FieldServiceModel.findOne({ moduleId: req.body._id }, function (err, fieldService) {
                if (err) {
                    res.statusCode = 500;
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({ error: 'Server error' });
                } else {
                    if (!fieldService) {
                        return ModuleEntryModel.findById({ _id: req.body._id }, function (err, deletedData) {
                            if (!deletedData) {
                                res.statusCode = 404;
                                return res.send({ error: 'Not found' });
                            }
                            return deletedData.remove(function (errors) {
                                if (!errors) {
                                    console.log('Removed module service data' + deletedData);
                                    return res.send({ status: 'OK' });
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
        }
    });
};

//calling api based method
router.get('/GetModuleData', GetModuleData);
router.post('/saveChanges', saveOrUpdateModule);
router.post('/Delete', deleteModule);


module.exports = router;