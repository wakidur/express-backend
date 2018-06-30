//dependencies
var express = require('express');
var router = express.Router();

var FieldValidationModel = require('../models/fieldValidationModel.js');


// save data into databse 
var saveChanges = function (req, res) {

    var objVlue = req.body;

    if (!objVlue._id) { // insert into database 
        //   console.log('POST  insert - /field Service' + objVlue.id);
        var fieldValidationObj = new FieldValidationModel({

            alphabet: objVlue.alphabet,
            applicationId: objVlue.applicationId,
            name: objVlue.name,
            message: objVlue.message
        });

        // get all data from databse 
        fieldValidationObj.save(function (err) {

            if (err) {
                //console.log('Error while saving fieldService: ' + err);
                return res.send({ error: err });
            } else {
                console.log("Field Service Create");
                return res.send({ status: 'OK', data: fieldValidationObj });

            }
        });
    } else {   // update data 

        return FieldValidationModel.findById(objVlue._id, function (err, fieldValidationObj) {

            if (!fieldValidationObj) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            if (objVlue.name != null) fieldValidationObj.name = objVlue.name;
            if (objVlue.message != null) fieldValidationObj.message = objVlue.message;

            return fieldValidationObj.save(function (err) {
                if (!err) {
                    // console.log('Updated');
                    return res.send({ status: 'OK', data: fieldValidationObj });
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

                res.send(fieldValidationObj);

            });
        });
    }

};

// get section page list 
var getFieldValidation = function (req, res) {

    return FieldValidationModel.find(function (err, data) {
        if (!err) {
            console.log("Field validation data");
            return res.send(data);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    }).sort({ applicationId: 1, alphabet: 1, name: 1 });
};

// delete page section 
var deleteField = function (req, res) {

    return FieldValidationModel.findById(req.body._id, function (err, entity) {
        if (!entity) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return entity.remove(function (err) {
            if (!err) {
                console.log('Removed entity successfully');
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });

};

var saveAllFieldValidation = function (req, res) {
    console.log("req obj " + req.body.length);

    for (var i = 0; i < req.body.length; i++) {

        var fieldValidationObj = new FieldValidationModel({

            name: req.body[i].name,
            alphabet: req.body[i].alphabet,
            message: req.body[i].message,
            applicationId: req.body[i].applicationId

        });

        console.log(fieldValidationObj);

        _saveFieldValidation(fieldValidationObj, req, res);
    }

    res.send({ status: 'OK', data: true });

};

function _saveFieldValidation(fieldValidationObj, req, res) {
    // get all data from databse 
    fieldValidationObj.save(function (err) {

        if (err) {
            //console.log('Error while saving fieldService: ' + err);
            return res.send({ error: err });
        } else {
            console.log("Field Service Create");
            //res.send({ status: 'OK', data: fieldValidationObj });
        }
    });
}

var copyAppValidation = function (req, res) {

    for (var i = 0; i < req.body.fieldList.length; i++) {

        var fieldObj = req.body.fieldList[i];
        _copyValidationMessage(req, res, fieldObj);
    }

    return res.send({ status: 'OK' });

}

function _copyValidationMessage(req, res, fieldObj) {

    return FieldValidationModel.findOne({ applicationId: fieldObj.applicationId, name: fieldObj.name }, function (err, field) {
        if (err) {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        } else {

            if (field) {    // update application data if same code is exist 
               
                if (fieldObj.name != null) field.name = fieldObj.name;
                if (fieldObj.message != null) field.message = fieldObj.message;

                field.save(function (err) {
                    if (err) {

                        if (err.name == 'ValidationError') {
                            res.statusCode = 400;
                            res.send({ error: 'Validation error' });
                        } else {
                            res.statusCode = 500;
                            res.send({ error: 'Server error' });
                        }
                        console.log('Internal error(%d): %s', res.statusCode, err.message);
                    } else {
                        console.log("updated successfully");
                    }
                });

            } else {    // insert new field into application 
                var fieldValidationObj = new FieldValidationModel({
                    name: fieldObj.name,
                    applicationId: fieldObj.applicationId,
                    message: fieldObj.message,
                    alphabet: fieldObj.alphabet
                });

                // save new copied appliation data 
                fieldValidationObj.save(function (err) {
                    if (err) {
                        //console.log('Error while saving fieldService: ' + err);
                        return res.send({ error: err });
                    } else {
                        console.log("insert successfully");
                    }
                });
            }
        }
    });
}



//calling api based method
router.post('/saveChanges', saveChanges);
router.get('/getFieldValidation', getFieldValidation);
router.post('/Delete', deleteField);

// save all field validation data from xml 
router.post('/saveAllFieldValidation', saveAllFieldValidation);

// copy validation message one to another app 
router.post('/copyAppValidation', copyAppValidation);

module.exports = router;