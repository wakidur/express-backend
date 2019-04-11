const expressJwt = require('express-jwt');
const config = require('../config/config');
const  _ = require('lodash');;


module.exports = authorize;

function authorize(roles = []) {
    const secret = config.jwtSecret;
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        expressJwt({
            secret
        }),

        // authorize based on user role
        (req, res, next) => {
            // if (roles.length && !roles.includes(req.user.roles)) {
            if (roles.length && !(_.isEqual(_.intersection(req.user.roles,roles), roles))) {
            // if (roles.length && !(_.isEqual(roles.sort(), req.user.roles.sort()))) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized'});
            }
            // authentication and authorization successful
            next();
        }
    ];
}