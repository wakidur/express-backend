/*
// step -1
exports.perimeter = function (width) {
    return 4 * width;
};

exports.area = function (width) {
    return width * width
};
*/

// step -2;

/*
exports.area = area;
exports.perimeter = perimeter;

function area(width) {
    return width * width
}

function perimeter(width) {
    return 4 * width;
}
*/
// step - 3

module.exports = {
    area: function(width) {
        return width * width;
    },
    perimeter : function(width) {
        return 4 * width;
    }
}

// step - 4 
// using class

// assigning to exprorts will not modify module, must use modile.exports

module.exports = class Square {
    constructor(width) {
        this.width = width;
     }

    area() {
        return this.width * 2;
    }

    perimeter() {
        return 4 * this.width;
    }
}

