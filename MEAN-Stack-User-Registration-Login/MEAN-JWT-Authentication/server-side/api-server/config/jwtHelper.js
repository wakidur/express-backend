const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
    var token;
    if ('authorization' in req.headers)
        token = req.headers['authorization'].split(' ')[1];

    if (!token)
        return res.status(403).send({
            auth: false,
            message: 'No token provided.'
        });
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
                if (err)
                    return res.status(500).json({
                        auth: false,
                        messageCustom: 'Token authentication failed.',
                        message: err.message,
                        name: err.name
                    });
                else {
                    req._id = decoded._id;
                    next();
                }
            }
        )
    }
}