/*----------------- require q -----------------*/
const Q = require('q');
const file = require('../model/catalog.json');
const Items = require('../model/catalogSchema');

function readCatalogSync(params) {
    if (file) {
        return file;
    } else {
        return undefined;
    }
}

function findItems(categoryId) {
    console.log('Returning all items for categoryId: ' + categoryId);
    let catalog = readCatalogSync();
    if (catalog) {
        let items = [];
        for (let index in catalog.catalog) {
            if (catalog.catalog[index].categoryId === categoryId) {
                let category = catalog.catalog[index];
                for (let itemIndex in category.items) {
                    items.push(category.items[itemIndex]);
                }
            }
        }
        return items;
    }
    return undefined;
}

function findItem(categoryId, itemId) {
    console.log('Looking for item with id' + itemId);
    let catalog = readCatalogSync();
    if (catalog) {
        for (let index in catalog.catalog) {
            if (catalog.catalog[index].categoryId === categoryId) {
                let category = catalog.catalog[index];
                for (let itemIndex in category.items) {
                    if (category.items[itemIndex].itemId === itemId) {
                        return category.items[itemIndex];
                    }
                }
            }
        }
    }
    return undefined;
}

function findCategoryies(params) {
    console.log('Returning all categories');
    let catalog = readCatalogSync();
    if (catalog) {
        let categories = [];
        for (let index in catalog.catalog) {
            let category = {};
            category["categoryId"] = catalog.catalog[index].categoryId;
            category["categoryName"] = catalog.catalog[index].categoryName;
            categories.push(category);
        }
        return categories;
    }
    return [];
}

function remove(data) {
    const item = new Items({
        itemId: data.itemId,
        itemName: data.itemName,
        price: data.price,
        currency: data.currency
    });
    
    let deferred = Q.defer();
    item.remove().then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
    
}

function findOne(itemId) {
    let deferred = Q.defer();
    Items.findOne(itemId).then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
    
}
module.exports = {
    findCategoryies,
    findItems,
    findItem,
    findOne,
    remove
}