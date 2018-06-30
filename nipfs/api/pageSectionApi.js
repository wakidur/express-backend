//dependencies
var express = require('express');
var router = express.Router();

var PageSectionModel = require('../models/pageSectionModel.js');

// save or update section service data 
var saveOrUpdateSectionService = function (req, res) {
    //console.log("enter save or update method");

    if (!req.body._id) {  // insert data 
        var pageSectionObj = new PageSectionModel({
            alphabet: req.body.alphabet,
            typeId: req.body.typeId,
            code: req.body.code,
            name: req.body.name,
            titleEN: req.body.titleEN,
            titleBN: req.body.titleBN,
            objectName: req.body.objectName,
        });

        // save data into database 
        pageSectionObj.save(function (err) {
            if (err) {
                //console.log('Error while saving fieldService: ' + err);
                return res.send({ error: err });
            } else {
                console.log("page section create ");
                return res.send({ status: 'OK', data: pageSectionObj });
            }
        });
    } else {  // udpate data 
        return PageSectionModel.findById(req.body._id, function (err, pageSectionEntity) {

            if (!pageSectionEntity) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            // fieldServiceData.id = objVlue.id;
            if (req.body.typeId != null) pageSectionEntity.typeId = req.body.typeId;
            if (req.body.name != null) pageSectionEntity.name = req.body.name;
            if (req.body.titleEN != null) pageSectionEntity.titleEN = req.body.titleEN;
            pageSectionEntity.titleBN = req.body.titleBN;
            pageSectionEntity.objectName = req.body.objectName;

            console.log("after customise" + pageSectionEntity);

            return pageSectionEntity.save(function (err) {
                if (!err) {
                    // console.log('Updated');
                    return res.send({ status: 'OK', data: pageSectionEntity });
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
var getAllPageSection = function (req, res) {

    return PageSectionModel.find(function (err, masterdata) {
        if (!err) {
            return res.send(masterdata);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    }).sort({ typeId:1,alphabet: 1, code: 1 });
};


// delete page section 
var deletePageSection = function (req, res) {

    return PageSectionModel.findById(req.body._id, function (err, pageSection) {
        if (!pageSection) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return pageSection.remove(function (err) {
            if (!err) {
                console.log('Removed page section data');
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });

};

var saveXMLData = function (req, res) {

    var fs = require("fs");

    var dir = './app/xmlFile';


    if (!fs.existsSync(dir)) {
        console.log(11);
        fs.mkdirSync(dir);
    }


    var path = "./app/xmlFile/Sections.xml";

    if (fs.existsSync(path)) {
        fs.unlinkSync(path);   // remove file from folder 
    }

    fs.writeFile(path, req.body.xml, function (error) {
        console.log("enter to write method");
        if (error) {
            console.error("write error:  " + error.message);
        } else {
            console.log("Successful Write to " + path);

        }
    });

    return res.send({ status: 'OK' });
};

//calling api based method
router.post('/saveChanges', saveOrUpdateSectionService);
router.get('/getAllPageSection', getAllPageSection);
router.post('/Delete', deletePageSection);
// save xml document into xml file 
router.post('/saveXMLData', saveXMLData);


module.exports = router;