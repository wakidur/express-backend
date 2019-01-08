
var messages = {
    save: "Saved Successfully",
    update: "Data updated successfully",
    deleted: "Data deleted Successfully",
    duplicate: "This entry already exist, Please provide different one",
    selectAlpRange: "Pleaes select alphabetic range",
    matchAlpRange: "Starting character should match with alphabetic range ",
    fieldUsagesCode: "You have already crossed the code range for fields under this alphabet. You cannot add any more fields",
    modulePageUsagesCode: "You have already crossed the code range for page under this module. You cannot add any more pages",
    usagesAnotherScope: "Error in deleting data. It might has been used in another scope",
    choseType: "First you should define type",
    generateXml: "Please select an application",
    copyOnetoOther: "Item copy successfully",
    requiredItem: "At least one item is required",
    fieldItemExist: "There is no field under this application or module",
    usedAsMainPage : "This page used as main page in another Scope"
    
};

var showSuccessSaveMsg = function () {
	toastr.success(messages.save);
};

var showSuccessUpdateMsg = function () {
    toastr.success(messages.update);
};

var showSuccessDeletedMsg = function() {
    toastr.success(messages.deleted);
};

var showDuplicateMsg = function() {
    toastr.warning(messages.duplicate);
};
var showWarningMsg = function () {
	toastr.warning(messages.save);
};

var showErrorMsg = function (ex) {
	toastr.error(ex.message);
};

var selectAlphabeticRangeMsg = function() {
    toastr.warning(messages.selectAlpRange);
};
var matchAlpRangeMsg = function () {
    toastr.warning(messages.matchAlpRange);
};
var fieldUsagesCodeMsg = function() {
    toastr.warning(messages.fieldUsagesCode);
};
var modulePageUsagesCodeMsg = function () {
    toastr.warning(messages.modulePageUsagesCode);
};
var usagesAnotherScopeMsg = function() {
    toastr.error(messages.usagesAnotherScope);
};
var choseTypeMsg = function() {
    toastr.warning(messages.choseType);
};
var xmlGenerateMsg = function() {
    toastr.warning(messages.generateXml);
};
var itemCopiedMsg = function () {
    toastr.success(messages.copyOnetoOther);
};
var requiredItemMsg = function () {
    toastr.warning(messages.requiredItem);
};
var fieldItemExistMsg = function() {
    toastr.warning(messages.fieldItemExist);
};
var usedAsMainPageMsg = function () {
    toastr.warning(messages.usedAsMainPage);
};