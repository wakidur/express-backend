//dependencies
var express = require('express');
var router = express.Router();

var FieldServiceModel = require('../models/fieldServiceModel.js');

var JsonDataModel = require('../models/jsonDataModel.js');

// field specification model 
var FieldSpecsModel = require('../models/fieldSpecsModal.js');

// _id is used to another scope 
var isExist = false;

// save data into databse 
var saveChanges = function (req, res) {

    var objVlue = req.body.fieldDetails[0];

    if (!objVlue.id) { // insert into database 
        //   console.log('POST  insert - /field Service' + objVlue.id);
        var fieldServicedataObj = new FieldServiceModel({

            // id: objVlue.id,
            refIndex: objVlue.refIndex,
            name: objVlue.name,
            l: objVlue.l,
            sh: objVlue.sh,
            fh: objVlue.fh,
            objectName: objVlue.objectName,
            desc: objVlue.desc,
            lBangla: objVlue.lBangla,
            shBangla: objVlue.shBangla,
            fhBangla: objVlue.fhBangla,
            descBangla: objVlue.descBangla,


            minLength: objVlue.minLength,
            maxLength: objVlue.maxLength,
            length: objVlue.length,
            permValues: objVlue.permValues,
            values: objVlue.values,
            dataType: objVlue.dataType,
            scale: objVlue.scale,
            applicationId: objVlue.applicationId

        });

        // get all data from databse 
        fieldServicedataObj.save(function (err) {

            if (err) {
                //console.log('Error while saving fieldService: ' + err);
                return res.send({ error: err });
            } else {
                console.log("Field Service Create");
                return res.send({ status: 'OK', data: fieldServicedataObj });

            }
        });
    } else {   // update data 

        return FieldServiceModel.findById(objVlue.id, function (err, fieldServiceData) {

            if (!fieldServiceData) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            if (objVlue.name != null) fieldServiceData.name = objVlue.name;
            fieldServiceData.l = objVlue.l;
            fieldServiceData.sh = objVlue.sh;
            fieldServiceData.fh = objVlue.fh;
            if (objVlue.refIndex != null) fieldServiceData.refIndex = objVlue.refIndex;
            fieldServiceData.desc = objVlue.desc;
            fieldServiceData.descBangla = objVlue.descBangla;
            fieldServiceData.lBangla = objVlue.lBangla;
            fieldServiceData.shBangla = objVlue.shBangla;
            fieldServiceData.fhBangla = objVlue.fhBangla;
            if (objVlue.objectName != null) fieldServiceData.objectName = objVlue.objectName;
            if (objVlue.minLength != null) fieldServiceData.minLength = objVlue.minLength;
            if (objVlue.maxLength != null) fieldServiceData.maxLength = objVlue.maxLength;
            if (objVlue.length != null) fieldServiceData.length = objVlue.length;
            fieldServiceData.permValues = objVlue.permValues;
            if (objVlue.values != null) fieldServiceData.values = objVlue.values;
            if (objVlue.dataType != null) fieldServiceData.dataType = objVlue.dataType;
            fieldServiceData.scale = objVlue.scale;
            if (objVlue.applicationId != null) fieldServiceData.applicationId = objVlue.applicationId;

            return fieldServiceData.save(function (err) {
                if (!err) {
                    // console.log('Updated');
                    return res.send({ status: 'OK', fieldServiceData: fieldServiceData });
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

// marge application into field 
var saveUpdateCopiedAppField = function (req, res) {
    //console.log(req.body);
    for (var i = 0; i < req.body.fieldList.length; i++) {

        var fieldObj = req.body.fieldList[i];
        _insertUpdateAppField(req, res, fieldObj);
    }
    
    return res.send({ status: 'OK'});
};


function _insertUpdateAppField(req, res, fieldObj) {

    return FieldServiceModel.findOne({ applicationId: fieldObj.applicationId, name: fieldObj.name}, function (err, field) {
        if (err) {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        } else {

            if (field) {    // update application data if same code is exist 
                console.log("enter for update ");

                if (fieldObj.name != null) field.name = fieldObj.name;
                field.l = fieldObj.l;
                field.sh = fieldObj.sh;
                field.fh = fieldObj.fh;
                field.desc = fieldObj.desc;
                field.descBangla = fieldObj.descBangla;
                field.lBangla = fieldObj.lBangla;
                field.shBangla = fieldObj.shBangla;
                field.fhBangla = fieldObj.fhBangla;
                if (fieldObj.objectName != null) field.objectName = fieldObj.objectName;
                if (fieldObj.minLength != null) field.minLength = fieldObj.minLength;
                if (fieldObj.maxLength != null) field.maxLength = fieldObj.maxLength;
                if (fieldObj.length != null) field.length = fieldObj.length;
                field.permValues = fieldObj.permValues;
                if (fieldObj.values != null) field.values = fieldObj.values;
                if (fieldObj.dataType != null) field.dataType = fieldObj.dataType;
                field.scale = fieldObj.scale;

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
                console.log("enter for insert ");

                console.log("index == " + fieldObj.refIndex);

                var fieldServicedataObj = new FieldServiceModel({
                    refIndex: fieldObj.refIndex,
                    name: fieldObj.name,
                    l: fieldObj.l,
                    sh: fieldObj.sh,
                    fh: fieldObj.fh,
                    objectName: fieldObj.objectName,
                    desc: fieldObj.desc,
                    lBangla: fieldObj.lBangla,
                    shBangla: fieldObj.shBangla,
                    fhBangla: fieldObj.fhBangla,
                    descBangla: fieldObj.descBangla,
                    minLength: fieldObj.minLength,
                    maxLength: fieldObj.maxLength,
                    length: fieldObj.length,
                    permValues: fieldObj.permValues,
                    values: fieldObj.values,
                    dataType: fieldObj.dataType,
                    scale: fieldObj.scale,
                    applicationId: fieldObj.applicationId

            });

                // save new copied appliation data 
                fieldServicedataObj.save(function (err) {
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


//get all field service data
var getAllFieldServiceData = function (req, res) {
    //  console.log("GET - /fieldService");
    return FieldServiceModel.find(function (err, fieldService) {
        if (!err) {
            // console.log("get Data");
            return res.send(fieldService);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    }).sort({refIndex: 1, code: 1 });
};


// delete field service from database
var deleteFieldService = function (req, res) {

    isExist = false;

    console.log("field id " + req.body.id);

    return FieldSpecsModel.find({ fieldId: req.body.id }, function (err, fieldSec) {

        for (var i = 0; i < fieldSec.length; i++) {
            if (fieldSec[i].fieldId) {
                isExist = true;
                break;
            }
        }

        console.log(isExist);

        if (isExist) {
            console.log("is exist ");
            return res.send({ status: 'OK', isExist: isExist });
        } else {

            console.log("is  not exist ");

            return FieldServiceModel.findById(req.body.id, function (err, fieldDataService) {
                if (!fieldDataService) {
                    res.statusCode = 404;
                    return res.send({ error: 'Not found' });
                }

                return fieldDataService.remove(function (err) {
                    if (!err) {
                        console.log('Removed field service data');
                        return res.send({ status: 'OK' });
                    } else {
                        res.statusCode = 500;
                        console.log('Internal error(%d): %s', res.statusCode, err.message);
                        return res.send({ error: 'Server error' });
                    }
                });
            });
        }
    });
};


// save json data into  JsonDataModel = require('../models/jsonDataModel.js');
var saveJsonData = function (req, res) {

    console.log("req obj " + req.body);
    var jsonDataObj = new JsonDataModel({
        fieldTitle: req.body

    });
    // get all data from databse 
    jsonDataObj.save(function (err) {
        console.log("enter save main function ");
        if (err) {
            console.log('Error while saving fieldService: ' + err);
            return res.send({ error: err });
        } else {
            console.log("json data save ");
            return res.send({ status: 'OK', data: jsonDataObj });

        }
    });

};

var saveAllFieldService = function (req, res) {
    console.log("req obj " + req.body.length);

    for (var i = 0; i < req.body.length; i++) {

        var fieldServicedataObj = new FieldServiceModel({

            objectName: req.body[i].objectName,
            name: req.body[i].name,
            //code: req.body[i].code,
            refIndex: req.body[i].range,
            l: req.body[i].l,   // label 
            sh: req.body[i].sh,
            fh: req.body[i].fh,
            desc: req.body[i].desc,
            lBangla: req.body[i].lBangla,
            shBangla: req.body[i].shBangla,
            fhBangla: req.body[i].fhBangla,
            descBangla: req.body[i].descBangla,
            minLength: req.body[i].minLength,
            maxLength: req.body[i].maxLength,
            length: req.body[i].length,
            values: req.body[i].values,
            dataType: req.body[i].dataType,
            scale: req.body[i].scale,
            applicationId: req.body[i].applicationId

        });

        console.log(fieldServicedataObj);

        _saveFieldTitle(fieldServicedataObj, req, res);
    }

    res.send({ status: 'OK', data: true });

};

function _saveFieldTitle(fieldServicedataObj, req, res) {
    // get all data from databse 
    fieldServicedataObj.save(function (err) {

        if (err) {
            //console.log('Error while saving fieldService: ' + err);
            return res.send({ error: err });
        } else {
            console.log("Field Service Create");
            //res.send({ status: 'OK', data: fieldServicedataObj });

        }

    });
}

var saveXMLData = function (req, res) {
    //console.log(1);
    var fs = require("fs");

    var dir = './app/xmlFile';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    console.log("xml path ==== "+req.body.xmlSavePath);

    // create english xml 
    var patheEng =  req.body.xmlSavePath +req.body.applicationName + '.xml';

    if (fs.existsSync(patheEng)) {
        fs.unlinkSync(patheEng);   // remove file from folder 
        fs.createWriteStream(patheEng); // create file into folder 
    }


    fs.writeFile(patheEng, req.body.xml, function (error) {
        if (error) {
            console.error("write error:  " + error.message);
        } else {
            console.log("Successful Write to " + patheEng);
        }
        // return true;
    });
    return res.send({ status: 'OK' });

};

var saveXMLBNData = function (req, res) {

    var fs = require("fs");

    var dir = './app/xmlFile';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    //var pathBan = "../app/xmlFile/FieldsTitleBangla.xml";
    var pathBan = './app/xmlFile/' + req.body.applicationName + 'BN' + '.xml';
    if (fs.existsSync(pathBan)) {
        fs.unlinkSync(pathBan);   // remove file from folder 
    }

    fs.writeFile(pathBan, req.body.xml, function (error) {
        if (error) {
            console.error("write error:  " + error.message);
        } else {
            console.log("Successful Write to " + pathBan);
        }
        // return true;
    });
    return res.send({ status: 'OK' });

};
//calling api based method
router.post('/saveChanges', saveChanges);
router.get('/getAllFieldService', getAllFieldServiceData);
router.post('/Delete', deleteFieldService);
router.post('/saveJsonData', saveJsonData);

// save all field title 
router.post('/saveAllFieldService', saveAllFieldService);

// save xml document into xml file 
router.post('/saveXMLData', saveXMLData);  // save english and all field xml data 
router.post('/saveXMLBNData', saveXMLBNData);  // save bengali xml data 
router.post('/copiedAppFieldService', saveUpdateCopiedAppField);

module.exports = router;