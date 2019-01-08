
var mongoose = require("mongoose");

//connection open and close
var accessDatabase = {
    startup: openDatabaseCon,
    closeDB: closeDatabaseCon
};

//open database connections
function openDatabaseCon(dbToUse) {
    mongoose.connect(dbToUse);
    //mongoose.connection.on('open', function () {
    //    console.log('We have connected to mongodb');
    //});
    mongoose.connection.once('open', function () {
        //console.log('We have connected to mongodb');
    });
    mongoose.connection.on('error', function () {
        console.log('Mongodb can not connected');
        process.exit(1);
    });
}

//close database connection
function closeDatabaseCon() {
    mongoose.disconnect();
}

//export as a module
module.exports = accessDatabase;