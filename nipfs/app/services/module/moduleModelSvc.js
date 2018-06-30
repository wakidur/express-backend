var app = angular.module('app');
app.factory('moduleModelSvc', [function () {
    var modelSvc = {
        checkDuplicateEntry: checkDuplicateEntry,
        checkDuplicateChild: checkDuplicateChild,
        usagesAnotherScope: usagesAnotherScope,
        checkDuplicateSection: checkDuplicateSection,

    };

    return modelSvc;


    // check duplicate module item into module list 
    function checkDuplicateEntry(entity, tempEntity, entityList, isModuleEdit) {
        try {
            var duplicate = false;

            if (tempEntity._id)
                if (entity.moduleId == tempEntity.moduleId)
                    return duplicate;

            var obj = Enumerable.From(entityList).FirstOrDefault(null, function (x) {
                return x.moduleId == entity.moduleId && x.applicationId == entity.applicationId;
            });

            if (obj) {
                duplicate = true;
            }
            return duplicate;
        } catch (e) {
            showErrorMsg(e);
        }
    }

    // check duplicate page into module page list 
    function checkDuplicateChild(entity, tempEntity, entityList, isPageEdit) {
        try {
            var duplicate = false;

            if (entity.pageObj._id) {  // check duplicate when any data is updeated 

                if (isPageEdit) {
                    if (entity.pageObj.pageName.toLowerCase() == tempEntity.pageObj.pageName.toLowerCase())
                        // ReSharper disable once ExpressionIsAlwaysConst
                        return duplicate;
                    // check page duplicate 
                    duplicate = _isDuplicatePage(entity, entityList);
                }
            } else {   // check duplicate when new data is inserted

                if (entityList.length == 1 && !entityList[0].pageName)
                    return duplicate;

                if (!entity.pageObj.pageName)
                    return duplicate;
                else
                    // check page duplicate 
                    duplicate = _isDuplicatePage(entity, entityList);
            }

            return duplicate;
        } catch (e) {
            throw e;
        }
    }


    // get pageList by module 

    function _isDuplicatePage(entity, entityList) {
        try {
            var isDuplicate = false;

            var moduleObj = Enumerable.From(entityList).FirstOrDefault(null, function (x) {
                return x._id == entity._id && x.applicationId == entity.applicationId;
            });

            var obj = Enumerable.From(moduleObj.pageList).FirstOrDefault(null, function (x) {
                return x.pageName.toLowerCase() == entity.pageObj.pageName.toLowerCase();
            });
            if (obj)
                isDuplicate = true;

            return isDuplicate;

        } catch (e) {
            throw e;
        }
    }

    // caheck section duplicate 
    function checkDuplicateSection(entity, tempEntity, entityList, isSectionChecked, isSectionEdit) {
        try {
            var duplicate = false;

            if (isSectionChecked) {
                if (entity.pageObj.sectionObj._id) {  // check duplicate section Name when any data is updeated 

                    if (isSectionEdit)
                        if (entity.pageObj.sectionObj.sectionName.toLowerCase() == tempEntity.pageObj.sectionObj.sectionName.toLowerCase())
                            // ReSharper disable once ExpressionIsAlwaysConst
                            return duplicate;

                    duplicate = _isSectionPage(entity, entityList);

                } else {  // for new entry 
                    duplicate = _isSectionPage(entity, entityList);
                }
            }

            return duplicate;
        } catch (e) {
            throw e;
        }
    }

    // check isSection Duplicate 
    function _isSectionPage(entity, entityList) {
        try {
            var isDuplicate = false;

            var moduleObj = Enumerable.From(entityList).FirstOrDefault(null, function (x) {
                return x._id === entity._id && x.applicationId == entity.applicationId;
            });
            if (moduleObj) {
                var pageObj = Enumerable.From(moduleObj.pageList).FirstOrDefault(null, function (x) {
                    return x._id === entity.pageObj._id;
                });
                if (pageObj) {
                    var sectionObj = Enumerable.From(pageObj.sectionList).FirstOrDefault(null, function (x) {
                        return x.sectionName.toLowerCase() === entity.pageObj.sectionObj.sectionName.toLowerCase();
                    });
                    if (sectionObj)
                        isDuplicate = true;
                }
            }
            return isDuplicate;
        } catch (e) {
            throw e;
        }
    }


    // check entity is used to another scope 
    function usagesAnotherScope(entity, fieldSpecsList, isModule) {
        try {
            var isUsed = false;

            if (!isModule) {  // check by page id 
                var pageObj = Enumerable.From(fieldSpecsList).FirstOrDefault(null, function (x) {
                    return x.pageId == entity._id;
                });

                if (pageObj)
                    isUsed = true;
            } else {  // check by module id 
                var modulObj = Enumerable.From(fieldSpecsList).FirstOrDefault(null, function (x) {
                    return x.moduleId == entity.moduleId;
                });
                if (modulObj)
                    isUsed = true;
            }
            return isUsed;
        } catch (e) {
            throw e;
        }
    }


}]);