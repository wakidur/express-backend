exports.some_model_count = function(req, res, next) {
	SomeModel.count({
		a_model_field: 'match_value'
	}, function(err, count){
		// do something if there is an err
		// on success, render the result by passing count into he render function (here, as the variable 'data');
		res.render('the_template', {data: count});
	});
};