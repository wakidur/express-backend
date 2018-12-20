const catalogSvc = require('../service/catalogService');

exports.getAllCategoryies = (req, res) => {
    console.log("get all ");
    let caterories = catalogSvc.findCategoryies();
    res.json(caterories);
}

exports.findItems = (req, res) => {
    var categories = catalogSvc.findItems(req.params.categoryId);
    if (categories === undefined) {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end('Not found');
    } else {
        res.json(categories);
    }

}
exports.findItem = (req, res) => {
    var item = catalogSvc.findItem(req.params.categoryId,
        req.params.itemId);
    if (item === undefined) {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end('Not found');
    } else {
        res.json(item);
    }
}

exports.remove = (req, res) => {
    console.log(`Deleting item with id: ' ${req.body.itemId}`);
    catalogSvc.findOne(req.body.itemId).then((data) => {
        if (!data) {
            res.status(404).json({"message":"Not Found"});
            return;
        } else {
            catalogSvc.remove(data).then((result) => {
                res.status(200).json({'Status': 'Successfully deleted'});
            }).catch((err) => {
                res.status(500).json({'message': 'Internal Server Error'});
            });
        }
    }).catch((err) => {
        res.status(500).json({
            "message": "Internal server error"
        });
    });
}