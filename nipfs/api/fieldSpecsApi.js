//dependencies
var express = require('express');
var router = express.Router();
var FieldServiceModel = require('../models/fieldServiceModel.js');

var ModelContainer = require('../models/moduleServiceModel.js');
var ModuleModel = ModelContainer[2];
/*var PageModel = ModelContainer[1];
var SectionModel = ModelContainer[0];*/

var FieldSpecsModel = require('../models/fieldSpecsModal.js');

//ModelContainer.pageSchema

//get all field service data
var getAllFieldService = function (req, res) {

    // console.log("GET - /fieldService");
    return FieldServiceModel.find(function (err, fieldService) {
        if (!err) {
            //console.log("get Data");
            return res.send(fieldService);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    }).sort({ refIndex: 1});
};

//get all field service data
var getAllModuleService = function (req, res) {
    //console.log("GET - /moduleService");
    return ModuleModel.find(function (err, masterdata) {
        if (!err) {
            // console.log(masterdata);
            return res.send(masterdata);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    }).sort({ moduleName: 1 });
};

// save or dupdate data pageId
var saveChanges = function (req, res) {
    //console.log("enter save or update method");
    if (!req.body._id) { // insert into database 
        //console.log("enter data for insersion ");
        var fieldSpecsModel = new FieldSpecsModel({
            moduleId: req.body.moduleId,
            pageId: req.body.pageId,
            mainPageId: req.body.mainPageId,
            fieldId: req.body.fieldId,
            sectionId: req.body.sectionId,
            fieldDesc: req.body.fieldDesc,
            maxLength: req.body.maxLength,
            minLength: req.body.minLength,
            scale: req.body.scale,
            length: req.body.length,
            isMandatory: req.body.isMandatory,
            permValues: req.body.permValues,
            isEditable: req.body.isEditable,
            inputTypeId: req.body.inputTypeId,
            shortFullTypeVal: req.body.shortFullTypeVal,
            applicationId: req.body.applicationId,
        });

        // save data into server 
        fieldSpecsModel.save(function (err) {

            if (err) {
                console.log('Error while saving fieldService: ' + err);
                return res.send({ error: err });
            } else {
                console.log("Field Specification Create");
                return res.send({ status: 'OK', data: fieldSpecsModel });
            }
        });
    } else {  // update data into database 

        return FieldSpecsModel.findById(req.body._id, function (err, fieldSpecs) {

            if (!fieldSpecs) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            if (req.body.moduleId != null) fieldSpecs.moduleId = req.body.moduleId;
            if (req.body.pageId != null) fieldSpecs.pageId = req.body.pageId;
            if (req.body.mainPageId != null) fieldSpecs.mainPageId = req.body.mainPageId;
            fieldSpecs.sectionId = req.body.sectionId;
            if (req.body.fieldId != null) fieldSpecs.fieldId = req.body.fieldId;
            fieldSpecs.fieldDesc = req.body.fieldDesc;
            fieldSpecs.maxLength = req.body.maxLength;
            fieldSpecs.minLength = req.body.minLength;
            fieldSpecs.scale = req.body.scale;
            fieldSpecs.length = req.body.length;
            fieldSpecs.isMandatory = req.body.isMandatory;
            if (req.body.permValues != null) fieldSpecs.permValues = req.body.permValues;
            if (req.body.isEditable != null) fieldSpecs.isEditable = req.body.isEditable;
            if (req.body.inputTypeId != null) fieldSpecs.inputTypeId = req.body.inputTypeId;
            if (req.body.shortFullTypeVal != null) fieldSpecs.shortFullTypeVal = req.body.shortFullTypeVal;
            if (req.body.applicationId != null) fieldSpecs.applicationId = req.body.applicationId;


            //console.log("after customise" + fieldServiceData);
            return fieldSpecs.save(function (err) {
                if (!err) {
                    console.log('Updated');
                    return res.send({ status: 'OK', fieldSpecs: fieldSpecs });
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

var getAllFieldSpecs = function (req, res) {
    // console.log("GET - /field specs");

    return FieldSpecsModel.find(function (err, masterdata) {
        if (!err) {
            //console.log(masterdata);
            return res.send(masterdata);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    }).sort({applicationId: 1 ,moduleId: 1, mainPageId:1,pageId: 1,sectionId:1});
};

// delete field service from database
var deleteFieldSpecs = function (req, res) {
    //console.log("enter delete method ");  
    return FieldSpecsModel.findById(req.body._id, function (err, fieldDataSpecs) {
        if (!fieldDataSpecs) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return fieldDataSpecs.remove(function (err) {
            if (!err) {
                console.log('Removed field specs data');
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
};


var Excel = require("exceljs");
var dir = '';
//var isDelete = false;

var createXls = function (req, res) {

    var fs = require('fs');

    var xlsName = req.body.fileName;
    var xlsData = req.body.xlsData;

    //var dir = '../app/excelFile';
    dir = "./app/excelFile";

    if (fs.existsSync(dir)) {
        //rmDir(dir);

    }

    // create folder 
    if (!fs.existsSync(dir)) {
        console.log("enter folder ");
        fs.mkdirSync(dir);
    }

    var path = './app/excelFile/' + xlsName + '.xls';

    if (fs.existsSync(path)) {
        fs.unlinkSync(path);   // remove file from folder 
        fs.createWriteStream(path); // create file into folder 
    }

    /*if (!fs.existsSync(path)) {
        fs.createWriteStream(path);
    }*/
    

    var options = {
        filename: path, // existing filepath
        useStyles: true, // Default
        useSharedStrings: true // Default
    };

    var workbook = new Excel.stream.xlsx.WorkbookWriter(options);
    var sheet = workbook.addWorksheet(xlsName);
    var worksheet = workbook.getWorksheet(xlsName);

    worksheet.columns = [
       { header: "Field", key: "name", width: 20, },
       { header: "Is SH/FH", key: "shortFullTypeName", width: 20 },
       { header: "permissible Value", key: "permValues", width: 40 },
       { header: "Is Mandatory", key: "isMandatory", width: 12 },
       { header: "DataType", key: "dataType", width: 10 },
       { header: "Max Length", key: "maxLength", width: 12 },
       { header: "Min Length", key: "minLength", width: 12 },
       { header: "Scale", key: "scale", width: 10 },
       { header: "Length", key: "length", width: 10 },
       { header: "Input Type", key: "inputType", width: 12 },
       { header: "Is Editable", key: "isEditable", width: 12 }
    ];


    for (var i = 0; i < xlsData.length ; i++) {
        worksheet.addRow({
            name: xlsData[i].name,
            shortFullTypeName: xlsData[i].shortFullTypeName,
            permValues: xlsData[i].permValues,
            isMandatory: xlsData[i].isMandatory == null ? "" : (xlsData[i].isMandatory == true ? "Yes" : "No"),
            dataType: xlsData[i].dataType,
            maxLength: xlsData[i].maxLength,
            minLength: xlsData[i].minLength,
            scale: xlsData[i].scale == null ? "" : xlsData[i].scale,
            length: xlsData[i].length,
            inputType: xlsData[i].inputType,
            isEditable: xlsData[i].isEditable == true ? "Yes" : "No"
        });
    }

    worksheet.commit(); // Need to commit the changes to the worksheet

    workbook.commit(); // Finish the workbook

    return res.send({ status: 'OK' });
};


var rmDir = function (dir) {

    console.log("enter folder ");
    var fs = require('fs');


    try {
        var files = fs.readdirSync(dir);
    }
    catch (e) { return; }
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var filePath = dir + '/' + files[i];
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            } else {
                console.log("recursive ");
                rmDir(filePath);
            }
        }
    }

    console.log("remove folder finally ");

    fs.rmdirSync(dir);

    console.log("remove folder finally 2");
    //fs.mkdirSync(dir);
};


//calling api based method
router.get('/getAllFieldService', getAllFieldService);
router.get('/getAllModuleService', getAllModuleService);
router.get('/getAllFieldSpecs', getAllFieldSpecs);
router.post('/saveChanges', saveChanges);
router.post('/Delete', deleteFieldSpecs);
router.post('/createXls', createXls);

module.exports = router;