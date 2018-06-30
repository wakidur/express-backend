toastr.options.timeOut = 4000;
toastr.options.positionClass = 'toast-bottom-right';

(function() {
    'use strict';

    angular.module('app', ['ngRoute', 'ngSanitize', 'ui.select', 'ui.bootstrap.modal', 'ui.bootstrap.tpls', 'ngPatternRestrict', 'generateExcel']);
})();



(function(){
    'use strict';

    angular
        .module('app')
        .config(appConfig);

        appConfig.$inject = ['$provide'];

    function appConfig($provide) {
        $provide.decorator('$exceptionHandler', ['$delegate', '$log', extendExceptionHandler]);

        function extendExceptionHandler($delegate, $log) {
            return function (exception, cause) {
                $delegate(exception, cause);
                var errorData = {
                    exception: exception,
                    cause: cause
                };
                var msg = 'ERROR PREFIX' + exception.message;
                $log.error(msg, errorData);
            };
        }

    }

}());



// //edited by shohel
// app.config(['$provide', exceptionConfig]);
// /*this config part written by shohel rana*/
// function exceptionConfig($provide) {
//     $provide.decorator('$exceptionHandler', ['$delegate', '$log', extendExceptionHandler]);
// }

// function extendExceptionHandler($delegate, $log) {
//     return function (exception, cause) {
//         $delegate(exception, cause);
//         var errorData = {
//             exception: exception,
//             cause: cause
//         };
//         var msg = 'ERROR PREFIX' + exception.message;
//         $log.error(msg, errorData);
//     };
// }

var apiServiceUrl = 'http://192.168.11.6:6661/api/';
//var apiServiceUrl = 'http://192.168.11.63:6661/api/';
//var apiServiceUrl = 'http://192.168.9.6:6661/api/';

//For Development
var appShortName = {
    Acc: "Acc",
    KDCA: "KDCA"
};

var xmlSavePath = {
    Acc: 'Z:/Work Share/DevelopmentShare/AccessoriesERPContent/newXmlFiles/',
    KDCA: 'Z:/Work Share/DevelopmentShare/compositeknitwear/newXmlFiles/'

};


var modalHeader = {
    createEnglishFields: "Generate Field title xml (English)",
    createBanglaFields: "GenerateField title xml(Bangla)",
    createFieldsValidation: "Generate Field validation xml"
}

////For Development to Test with http://192.168.9.6
//var appShortName = {
//    Acc: "Acc",
//    KDCA: "KDCA"
//}

//var xmlSavePath = {
//    Acc: 'Z:/Work Share/DevelopmentShare/AccessoriesERPContent/xmlfiles/',
//    KDCA: 'Z:/Work Share/DevelopmentShare/compositeknitwear/xmlfiles/'

//}


//html code: ni-control-focus="propertyname"
//javascript setFocus("propertyname")
function setFocus(properyName) {
    try {
        var timeout = setTimeout(function () {
            var element = $('body').find("[ni-control-focus='" + properyName + "']");
            element.length > 0 && element[0].focus();
            clearTimeout(timeout);
        }, 2);
    } catch (ex) {
        throw ex;
    }
}


var dataType = {
    Text: {
        id: 1,
        name: "Text"
    },
    Int: {
        id: 2,
        name: "Integer"
    },
    Number: {
        id: 3,
        name: "Numeric"
    },
    Date: {
        id: 4,
        name: "Date"
    },
    Time: {
        id: 5,
        name: "Time"
    },
    DataTime: {
        id: 6,
        name: "Date & Time"
    }
};

// input type enum variable 
var inputType = {
    Auto: {
        id: 1,
        name: "Auto"
    },
    Select: {
        id: 2,
        name: "Select"
    },
    Entry: {
        id: 3,
        name: "Entry"
    },
    SelectEntry: {
        id: 4,
        name: "Select/Entry"
    },
    SelectAuto: {
        id: 5,
        name: "Select/Auto"
    },
    EntryAuto: {
        id: 6,
        name: "Entry/Auto"
    },
    MultiSelect: {
        id: 7,
        name: "Multi-Select"
    },
    SelectEntryAuto: {
        id: 8,
        name: "Select/Entry/Auto"
    }
};

// short/ full name enum variable 
var shortFullType = {
    Short: {
        value: 's',
        name: "Short"
    },
    Full: {
        value: 'f',
        name: "Full"
    },
};

// range  type enum variable 
var rangeType = {
    A: {
        id: 1,
        name: 'A',
        range: "100-300"
    },
    B: {
        id: 2,
        name: 'B',
        range: "301-500"
    },
    C: {
        id: 3,
        name: 'C',
        range: "501-700"
    },
    D: {
        id: 4,
        name: 'D',
        range: "701-900"
    },
    E: {
        id: 5,
        name: 'E',
        range: "901-1100"
    },
    F: {
        id: 6,
        name: 'F',
        range: "1101-1300"
    },
    G: {
        id: 7,
        name: 'G',
        range: "1301-1500"
    },
    H: {
        id: 8,
        name: 'H',
        range: "1501-1700"
    },
    I: {
        id: 9,
        name: 'I',
        range: "1701-1900"
    },
    J: {
        id: 10,
        name: 'J',
        range: "1901-2100"
    },
    K: {
        id: 11,
        name: 'K',
        range: "2101-2300"
    },
    L: {
        id: 12,
        name: 'L',
        range: "2301-2500"
    },
    M: {
        id: 13,
        name: 'M',
        range: "2501-2700"
    },
    N: {
        id: 14,
        name: 'N',
        range: "2701-2900"
    },
    O: {
        id: 15,
        name: 'O',
        range: "2901-3100"
    },
    P: {
        id: 16,
        name: 'P',
        range: "3101-3300"
    },
    Q: {
        id: 17,
        name: 'Q',
        range: "3301-3500"
    },
    R: {
        id: 18,
        name: 'R',
        range: "3501-3700"
    },
    S: {
        id: 19,
        name: 'S',
        range: "3701-3900"
    },
    T: {
        id: 20,
        name: 'T',
        range: "3901-4100"
    },
    U: {
        id: 21,
        name: 'U',
        range: "4101-4300"
    },
    V: {
        id: 22,
        name: 'V',
        range: "4301-4500"
    },
    W: {
        id: 23,
        name: 'W',
        range: "4501-4700"
    },
    X: {
        id: 24,
        name: 'X',
        range: "4701-4900"
    },
    Y: {
        id: 25,
        name: 'Y',
        range: "4901-5100"
    },
    Z: {
        id: 26,
        name: 'Z',
        range: "5101-5300"
    }
};


// page type 
var pageType = {
    PageHeaders: {
        id: 1,
        name: "Page Headers"
    },
    SectionHeaders: {
        id: 2,
        name: "Section Headeres"
    },
    Entry: {
        id: 3,
        name: "Entry"
    },
    Navigation: {
        id: 4,
        name: "Navigation"
    },
    Button: {
        id: 5,
        name: "Button"
    },
    Others: {
        id: 6,
        name: "Others"
    }
};

// retrun index from object array 
var _findIndexByKeyValue = function (arraytosearch, key, valuetosearch) {
    try {
        for (var i = 0; i < arraytosearch.length; i++) {
            if (arraytosearch[i][key] == valuetosearch) {
                return i;
            }
        }
        return -1;
    } catch (e) {
        showErrorMsg(e);
    }
};