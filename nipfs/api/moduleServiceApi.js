
//dependencies
var express = require('express');
var router = express.Router();
var ModelContainer = require('../models/moduleServiceModel.js');
var ModuleModel = ModelContainer[2];
var PageModel = ModelContainer[1];
var SectionModel = ModelContainer[0];

var FieldServiceModel = require('../models/fieldServiceModel.js');

// field specification model 
var FieldSpecsModel = require('../models/fieldSpecsModal.js');

// check _id is used to another scope(another page is used this entity)
var isExist = false;

//save module service
var saveOrUpdateModuleService = function (req, res) {

    if (!req.body._id) {
        //parent for module
        var parent = new ModuleModel({
            moduleId: req.body.moduleId,
            //moduleCode: req.body.moduleCode,
            fromPageRange: req.body.fromPageRange,
            toPageRange: req.body.toPageRange,
            applicationId: req.body.applicationId,

        });

        if (req.body.pageObj.pageName) {
            var pageObj = new PageModel({
                pageName: req.body.pageObj.pageName,
                pageCode: req.body.pageObj.pageCode,
                description: req.body.pageObj.description,
                isMainPage: req.body.pageObj.isMainPage
            });
            // save section data 
            if (req.body.pageObj.sectionObj.sectionName) {
                var sectionObj = new SectionModel({
                    sectionName: req.body.pageObj.sectionObj.sectionName,
                    sectionDesc: req.body.pageObj.sectionObj.sectionDesc,
                });
                pageObj.sectionList.push(sectionObj);   // add new section into page list object 
            }

            parent.pageList.push(pageObj);
        }

        //console.log("parent "+parent);

        parent.save(function (err, savedParent) {

            //console.log("6");

            if (err) {
                return res.send({ error: 'Server error' });
            }
            return res.send({ status: 'OK', data: savedParent });
        });
    } else {

        return ModuleModel.findById(req.body._id, function (err, module) {
            if (!module) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            // update module name 
            module.applicationId = req.body.applicationId;
            module.moduleId = req.body.moduleId;

            // page list is not found 
            if (req.body.pageObj._id) {  // update page 
                for (var j = 0; j < module.pageList.length; j++) {
                    if (module.pageList[j]._id == req.body.pageObj._id) {

                        module.pageList[j].pageName = req.body.pageObj.pageName;
                        module.pageList[j].description = req.body.pageObj.description;
                        module.pageList[j].isMainPage = req.body.pageObj.isMainPage;

                        // update or insert section into page 
                        if (req.body.pageObj.sectionObj._id) {  // update section 
                            for (var k = 0; k < module.pageList[j].sectionList.length; k++) {  // update section if match 
                                if (module.pageList[j].sectionList[k]._id == req.body.pageObj.sectionObj._id) {
                                    module.pageList[j].sectionList[k].sectionName = req.body.pageObj.sectionObj.sectionName;
                                    module.pageList[j].sectionList[k].sectionDesc = req.body.pageObj.sectionObj.sectionDesc;
                                }
                            }
                        } else {    // insert new section 
                            if (req.body.pageObj.sectionObj.sectionName) {
                                module.pageList[j].sectionList.push(new SectionModel({
                                    sectionName: req.body.pageObj.sectionObj.sectionName,
                                    sectionDesc: req.body.pageObj.sectionObj.sectionDesc
                                }));
                            }
                            //console.log("section "+module.pageList[j].sectionList);
                        }
                    }
                }
            } else {  // insert new page into module 

                if (req.body.pageObj.pageName) {
                    var pageEntity = new PageModel({
                        pageName: req.body.pageObj.pageName,
                        pageCode: req.body.pageObj.pageCode,
                        description: req.body.pageObj.description,
                        isMainPage: req.body.pageObj.isMainPage
                    });
                    if (req.body.pageObj.sectionObj.sectionName) {
                        var sectionEntity = new SectionModel({
                            sectionName: req.body.pageObj.sectionObj.sectionName,
                            sectionDesc: req.body.pageObj.sectionObj.sectionDesc
                        });

                        // console.log(sectionEntity);
                        pageEntity.sectionList.push(sectionEntity);   // add new section into page list object  
                    }
                    module.pageList.push(pageEntity);
                }
            }

            //console.log("module " +module);

            return module.save(function (error, updatedParent) {
                if (error) {
                    return res.send({ error: 'Server error' });
                }
                //console.log("Parent " + updatedParent);
                return res.send({ status: 'OK', data: updatedParent });
            });
        });
    }
    // }

};

//get all field service data
var GetAllModuleService = function (req, res) {
    console.log("GET - /moduleService");
    return ModuleModel.find(function (err, data) {
        console.log("get data ");
        if (!err) {
            //console.log(masterdata);
            return res.send(data);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    }).sort({ moduleId: 1 });
};


// delete section list from page
var deleteSection = function (req, res) {
    // this item is used in another scope 
    isExist = false;
    console.log("enter section delete " + req.body._id);

    return FieldSpecsModel.find({ sectionId: req.body._id }, function (err, fieldSec) {
        console.log("3");
        for (var i = 0; i < fieldSec.length; i++) {
            console.log("4");

            if (fieldSec[i].sectionId) {
                isExist = true;
                console.log("5");
                break;
            }
        }

        console.log("2 ");
        if (isExist) {
            console.log("is exist ");  // this item is used in another scope 
            return res.send({ status: 'OK', isExist: isExist });
        } else {
            console.log("3");
            // delete secton from server 
            ModuleModel.findById(req.body.moduleId, function (err, moduleData) {
                if (!moduleData) {
                    res.statusCode = 404;
                    return res.send({ error: 'Not found' });
                }
                for (var j = 0; j < moduleData.pageList.length; j++) {
                    if (moduleData.pageList[j]._id == req.body.pageId) {

                        console.log("page id " + moduleData.pageList[j]._id);

                        for (var k = 0; k < moduleData.pageList[j].sectionList.length; k++) {
                            if (moduleData.pageList[j].sectionList[k]._id == req.body._id) {

                                console.log("section id" + moduleData.pageList[j].sectionList[k]);

                                moduleData.pageList[j].sectionList[k].remove(function (errors) {
                                    if (!errors) {
                                        console.log('Removed section data->' + req.body._id);
                                        //return res.send({ status: 'OK' });
                                    } else {
                                        res.statusCode = 500;
                                        console.log('Internal error(%d): %s', res.statusCode, err.message);
                                        return res.send({ error: 'Server error' });
                                    }
                                    return res.send({ error: 'Server error' });
                                });
                            }
                        }
                    }
                }

                return moduleData.save(function (err) {
                    if (err) {
                        res.statusCode = 500;
                        console.log('Internal error(%d): %s', res.statusCode, err.message);
                        return res.send({ error: 'Server error' });
                    } else {
                        console.log("save data ");
                    }
                });

            });
        }
    });

};

// delete page list data from module 
var deletePage = function (req, res) {
    // this item is used in another scope 
    isExist = false;

    return FieldSpecsModel.find({ pageId: req.body._id }, function (err, fieldSec) {

        for (var i = 0; i < fieldSec.length; i++) {
            if (fieldSec[i].pageId) {
                isExist = true;
                break;
            }
        }

        if (isExist) {
            console.log("is exist ");
            return res.send({ status: 'OK', isExist: isExist });
        } else {

            //console.log("Module ID->" + moduleId);
            ModuleModel.findById(req.body.moduleId, function (err, moduleData) {
                if (!moduleData) {
                    res.statusCode = 404;
                    return res.send({ error: 'Not found' });
                }

                for (var j = 0; j < moduleData.pageList.length; j++) {
                    if (moduleData.pageList[j]._id == req.body._id) {


                        moduleData.pageList[j].remove(function (errors) {
                            if (!errors) {
                                console.log('Removed Page data->' + req.body._id);
                                //return res.send({ status: 'OK' });
                            } else {
                                res.statusCode = 500;
                                console.log('Internal error(%d): %s', res.statusCode, err.message);
                                return res.send({ error: 'Server error' });
                            }
                            return res.send({ error: 'Server error' });
                        });
                    }
                }
                return moduleData.save(function (err) {
                    if (err) {
                        res.statusCode = 500;
                        console.log('Internal error(%d): %s', res.statusCode, err.message);
                        return res.send({ error: 'Server error' });
                    } else {
                        console.log("save data ");
                    }
                });
            });
        }
    });
};


function getFieldSpec(req, res) {

    return FieldSpecsModel.find(function (err, fields) {
        //console.log("fieldSpc 1  ==================== " + fields);
        if (!fields) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
    });
}

// delete module data with page list 
var deleteMasterModule = function (req, res) {
    var isExist = false;
    var async = require('async');

    //var module;
    var fieldSpcList;    // field specification list 
    async.series([
        function (callback) {
            // get field specification list 
            getFieldSpec(req, res).then(function (val) {
                fieldSpcList = val;
            });

            callback();
        }, function () {
            return ModuleModel.findById(req.body._id, function (err, module) {
                // console.log("last  =================  " + module);
                if (!module) {
                    res.statusCode = 404;
                    return res.send({ error: 'Not found' });
                }

                // check any module page is exist into field specification list 
                for (var i = 0; i < module.pageList.length; i++) {
                    var arrayFound = fieldSpcList.filter(function (item) {
                        return item.pageId == module.pageList[i]._id;
                    });
                    if (arrayFound.length > 0) {
                        isExist = true;
                        break;
                    }
                }

                if (!isExist) {  // if not exist then execute delete operation 
                    return module.remove(function (err) {
                        if (!err) {
                            console.log('Removed module ');
                            return res.send({ status: 'OK', isExist: false });
                        } else {
                            res.statusCode = 500;
                            console.log('Internal error(%d): %s', res.statusCode, err.message);
                            return res.send({ error: 'Server error' });
                        }
                    });
                } else {
                    return res.send({ status: 'OK', isExist: true });
                }
            });

        }
    ]);
};


// get item from field specification by main page id 
var GetMainPageData = function (req, res) {

    console.log(req.body._id);

    return FieldSpecsModel.findOne({ mainPageId: req.body._id }, function (err, field) {
        if (field)
            return res.send({ status: 'OK', data: field });
        else
            return res.send({ status: 'OK', data: null });

    });
}

//calling api based method
router.post('/saveChanges', saveOrUpdateModuleService);
router.get('/GetModuleServiceData', GetAllModuleService);
router.post('/Delete', deletePage);
router.post('/masterModuleDelete', deleteMasterModule);
router.post('/sectionDelete', deleteSection);
router.post('/GetMainPageData', GetMainPageData);


module.exports = router;