const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const User = require('../models/user.model');

function getRegister(req, res, next) {
    console.log(`user register controller get`);
    res
        .status(200)
        .json({
            token: "token"
        });
}
function postRegister(req, res, next) {
    
    let user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
}

function authenticateUser (req, res, next) {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports = {
    getRegister,
    postRegister,
    authenticateUser
};