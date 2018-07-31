{
    "_id" : "azEWQn9MAq54ncBV1sw0Vk63NXbMgi0J",
    "session" : "{
		\"cookie\":{
			\"originalMaxAge\":1209600000,
			\"expires\":\"2018-08-01T11:04:10.440Z\",
			\"httpOnly\":true,
			\"path\":\"/\"},
			\"_csrfSecret\":\"9sEMCjOEC7Hzaw==\"}",
    "expires" : ISODate("2018-08-01T11:04:10.440Z")
}

vm.application

name:"aaaa"
shortName:"aaadd"
__v:0
_id:"5b583bdc6efadec81e8268ab"

vm.tempApplication

name : "aaaa" 
shortName : "aaadd"
__v : 0
_id : "5b583bdc6efadec81e8268ab"

--------------------------------------------------------------
/* Applcation route, controller, dataSve, modelSve, */

// variable binding  
vm.application = {}; // main object for applicaiton 
vm.serverDataList = []; // server data 
vm.applicationList = []; // data for showing grid view 
vm.isCancelBtnShow = false; // cancel button show hide 
vm.tempApplication = {};

data-ng-submit="submitForm(applicationForm.$valid)"

submitForm(applicationForm.$valid)
reset()
cancel()
edit(entity)
deleteApplication(entity)

--------------
paging.fromShowing
paging.toShowing
paging.total
paging.pagingOptions

pageniToFirst()
pageniBackward()
pageniForward()
pageniToLast()

/********** Client side request path  *//
var apiServiceUrl = 'http://localhost:6661/api/';
var serviceUrl = apiServiceUrl + 'applicationData/';
var getApplicationUrl = serviceUrl + 'getApplication';

//http://localhost:6661/api/applicationData/getApplication



/********** Server side URL ***************/
app.use('/api' + '/applicationData', applicationDataRoute);

//http://localhost:6666/api/applicationData/getApplication

//http://localhost:6666/api/fieldServicedata/SaveFieldServiceData




function getBooksData(httpVarv) {
	try {
		var deferred = $q.defer();
		$http.get(httpVarv).then(function (results) {
			deferred.resolve(results.data);
		}).catch(function (error) {
			deferred.reject(error);
		});
		return deferred.promise;
	} catch (error) {
		throw error;
	}
}


/**
 * recommended
 * Using function declarations
 * and accessible members up top.
 */
function dataservice($http, $location, $q, exception, logger) {
    var isPrimed = false;
    var primePromise;

    var service = {
        getAvengersCast: getAvengersCast,
        getAvengerCount: getAvengerCount,
        getAvengers: getAvengers,
        ready: ready
    };

    return service;

    ////////////

    function getAvengers() {
        // implementation details go here
    }

    function getAvengerCount() {
        // implementation details go here
    }

    function getAvengersCast() {
        // implementation details go here
    }

    function prime() {
        // implementation details go here
    }

    function ready(nextPromises) {
        // implementation details go here
    }
}