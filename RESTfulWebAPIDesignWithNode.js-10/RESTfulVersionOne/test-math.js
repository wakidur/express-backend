const math = require('./math');

// exports.addTest = function (test) {
//     test.equal(math.add(1, 1), 2);
//     test.done();
// }
exports.addTest = function (test) {
    test.equal(math.add(1, 1), 3);
    test.done();
}

exports.subtractTest = function (test) {
    // body
    test.equal(math.subtract(4, 2), 2);
    test.done();
}