const config = require('../config/config');
const jwt = require('jsonwebtoken');
const Role = require('../config/role');
const UserRoles = require('../model/userRolesSchema');
const User = require('../model/userSchema');


module.exports = {
    getUserRoleById,
    getAllUserAccounts,
    getUserAccountById
};

function getUserRoleById(userId) {
    return new Promise((resolve, reject) => {
        UserRoles.find({
                user_id: userId
            }).populate('role_id', 'name')
            .then((result) => {
                resolve(result);
            })
            .catch(reject);
    });
}


function getAllUserAccounts() {
    return new Promise((resolve, reject) => {
        User.find({}, 'fullname email userImage').then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
}

function getUserAccountById(id) {
    return new Promise((resolve, reject) => {
        User.findById(id).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
}