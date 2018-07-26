let appliDataSvc = require("../services/dataService/applicationDataService");


// Get section page list
function getAppication(req, res) {
    appliDataSvc.getAppication().then((data) => {
        res.send(data);
    }).catch((err) => {
        return next(err);
    });
}

module.exports = {
    getAppication,
}