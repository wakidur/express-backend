const fs = require('fs');
const file = require('../model/catalog.json');

function readCatalogSync(params) {
    var file = '../model/catalog.json';
    if (fs.existsSync(file).catalog) {
        console.log(fs.existsSync(file).catalog);
        console.log(fs.existsSync(file).length);
        console.log("say hello");
    }
    if (fs.existsSync(file)) {
        var content = fs.readFileSync(file);
        var catalog = JSON.parse(content);
        return catalog;
    } else {
        return undefined;
    }
}

function findItems(params) {

}

function findCategoryies(params) {
    console.log('Returning all categories');
    var catalog = file;
    if (catalog) {
        var categories = [];
        for (var index in catalog.catalog) {
            var category = {};
            category["categoryId"] = catalog.catalog[index].categoryId;
            category["categoryName"] = catalog.catalog[index].categoryName;

            categories.push(category);
        }
        return categories;
    } else {
        return [];
    }
}
module.exports = {
    findCategoryies,
    findItems
}