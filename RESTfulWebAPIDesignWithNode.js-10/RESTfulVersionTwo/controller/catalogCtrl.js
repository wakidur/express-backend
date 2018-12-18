const catalogSvc = require('../service/catalogService')

exports.getAllCategoryies =  (req, res) => {
    console.log("get all ");
    let caterories = catalogSvc.findCategoryies();
    res.json(caterories);
}