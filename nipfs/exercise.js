 // route for the home page
 .when('/', {
 	templateUrl: 'app/views/application.html',
 	controller: 'applicationCtrl'
 })

 /***************application controller***************/
 function action(params) {
 	try {
 		// application page initializetion
 		_initApplication();
 		// get server data
 		getServerData();
 	} catch (error) {
 		showErrorMsg(error);
 	}
 }
 // Initialize applicationCtrl
 function _initApplication() {
 	try {
 		// initialize new application
 		vm.application = new application();
 		vm.tempApplication = {};
 		vm.isCancelBtnShow = false;
 	} catch (error) {
 		showErrorMsg(error);
 	}

 }

 // get application data 
 function getServerData(params) {
 	try {
 		let tick = (new Date()).getTime().toString();
 		dataSvc.getApplication(tick).then((result) => {
 			// get flat object array list
 			vm.serverDataList = angular.copy(result);

 			// prepare grid  view and pagination
 			search(vm.serverDataList);
 		}).catch((err) => {
 			showErrorMsg(err);
 		});
 	} catch (error) {
 		showErrorMsg(error);
 	}
 }

 // Manage grid 
 vm.criteria = {
 	page: 1, // no of page
 	pagesize: 10, // showing data into one page
 };

 vm.paging = {
 	total: 0,
 	totalpages: 0,
 	formShowing: 0,
 	toShowing: 0,
 	pagingOptions: [], // page size 
 	tempPaginationOption: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800] // temp page size 
 };

 var watchData = vm.$watch('criteria', function (newvalue, oldvalue) {
 	if (!angular.equals(newvalue, oldvalue)) {
 		if (newvalue.page <= vm.paging.totalpages) {
 			search(vm.serverDataList);
 		} else {
 			vm.criteria.page = 1;
 		}
 	}
 }, true);


 // search data 
 function search(flatObjectArrayList) {
 	try {
 		// set order
 		flatObjectArrayList = Enumarable.Form(flatObjectArrayList).whare(function (x) {
 			return x;
 		}).OrderBy("$.name").ToArray();
 		vm.paging.total = flatObjectArrayList.length;
 		if (!vm.isPaginationOptionChange)
 			vm.criteria.pagesize = 10; // set default page size 
 		vm.paging.totalpages = (Math.ceil(flatObjectArrayList.length / vm.criteria.pagesize)) == 0 ? 1 : (Math.ceil(flatObjectArrayList.length / vm.criteria.pagesize));
 		// set pagination option
 		if (!vm.isPaginationOptionChange) {
 			vm.paging.pagingOptions.length = 0;
 			for (let i = 0; i < vm.paging.length; i++) {
 				if (vm.paging.tempPaginationOption.length > i) {
 					vm.paging.pagingOptions.push(vm.paging.tempPaginationOption[i]);
 				}
 				vm.isPaginationOptionChange = true;
 			}
 			_getGridViewList(flatObjectArrayList, vm.criteria);
 		}

 	} catch (error) {
 		showErrorMsg(error);
 	}
 }

 // Get grit view list 
 function _getGridViewList(list, entity) {
 	try {
 		vm.applicationList.length = 0;
 		vm.applicationList = getFileterData(list, entity);
 	} catch (error) {
 		showErrorMsg(error);
 	}
 }


 // get Fileterdata 
 function getFileterData(list, entity) {
 	try {
 		let dataList = [];
 		if (!entity.page || entity.page == 1) {
 			let pageNo = !entity.page ? 1 : entity.page;

 			if (list.length >= 10) {
 				vm.paging.formShowing = 10;
 				if (list.length < entity.pagesize) {
 					vm.paging.toShowing = list.length;
 				} else {
 					vm.paging.toShowing = entity.pagesize;
 				}
 			} else if (list.length == 0) {
 				vm.paging.formShowing = 0;
 				vm.paging.toShowing = 0;
 			}

 			for (let i = 0; i < list.length; i++) {
 				if (i < pageNo * entity.pagesize) {
 					dataList.push(list[i]);
 				}

 			}
 			if (list.length < 10 && list.length != 0) {
 				vm.paging.formShowing = 1;
 				vm.paging.toShowing = dataList.length;
 			}
 		} else {
 			if (entity.page <= vm.paging.totalpages) {
 				let fromPageNo = (entity.page * entity.pagesize) - entity.pagesize + 1;
 				let tempToPageNo = fromPageNo + entity.pagesize;

 				for (var k = fromPageNo; k < tempToPageNo; k++) {
 					if (list[k - 1]) {
 						dataList.push(list[k - 1]);
 					}
 				}
 				vm.paging.fromShowing = fromPageNo;
 				vm.paging.toShowing = fromPageNo + dataList.length - 1;
 			}
 		}
 		return dataList;
 	} catch (error) {
 		showErrorMsg(error);
 	}
 }

 // Object defination
 function application(defaultData) {
 	defaultData = defaultData || {};
 	this._id = defaultData._id || null;
 	this.name = defaultData.name || null;
 	this.showName = defaultData.shortName || null;
 }