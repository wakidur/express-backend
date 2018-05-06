/**
 * 2.1 Asynchronous flow control using async
 */
exports.some_model_count = function (req, res, next) {
	SomeModel.count({
		a_model_field: 'match_value'
	}, function (err, count) {
		// ... do something if there is an err

		// On success, render the result by passing count into the render function (here, as the variable 'data').
		res.render('the_template', {
			data: count
		});
	});
};

/**
 * 2.1.2 Asynchronous operations in parallel
 */
async.parallel({
	one: function (callback) {},
	two: function (callback) {},
	something_else: function (callback) {},
}, function (err, results) {
	// 'results' is now equal to: {one: 1, two: 2, something_else: some_value  }
});


/**
 *  2.1.3 Asynchronous operations in series 
 */
async.series({
	one: function (callback) {},
	two: function (callback) {},
	three: function (callback) {},
}, function (err, results) {
	// 'results' is now equals to: {one: 1, two: 2, three: some_value} 
});

async.series([
	function (callback) {
		// do some stuff...
		callback(null, 'one');
	},
	function (callback) {
		//do some more stuff...
		callback(null, 'two');
	}
], function (err, results) {
	// results is now qural to ['one', 'two']
});


/**
 * 2.1.4 Dependent asynchronous operations in series
 */

async.waterfall([
	function (callback) {
		callback(null, 'one', 'two');
	},
	function (arg1, arg2, callback) {
		// arg1 now equals 'one' and arg2 now equals 'two' 
		callback(null, 'three');
	},
	function (arg1, callback) {
		// arg1 now equals 'three'
		callback(null, 'done');
	}
], function(err, result) {
	// result now equals 'done'
})