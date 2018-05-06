/**
 * To use the validator in our controllers we have to require the functions we want to use from the 'express-validator.check', and  'express-validator/filter' modules, as show bellow.
 * 
 */

const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter')


/**
 * body(fields[, message])
 */

 body('name', 'Empty name').isLength({min: 1}),
 body('age', 'Invalid age').optional({checkFalsy: true}).isISO8601();

 body('name').isLength({ min: 1}).trim().withMessage('Name empty').isAlpha().withMessage('Name must be alphabet letters.');

 /**
  * sanitizeBody(fields)
  */
 sanitizeBody('name').trim().escape(),
 sanitizeBody('data').toDate()

 /**
  * validationResult(req)
  */
 (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // There are errors. Render form again whit sanitized values/errors message
        // Error message can be returned in an array using 'errors.array()'
    } else {
        // Data from form is valid.
    }
 }