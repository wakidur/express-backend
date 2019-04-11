const config = require('../config/config');
const jwt = require('jsonwebtoken');
const Role = require('../config/role');
const UserRoles = require('../model/userRolesSchema');


module.exports = {
    getUserRoleById
};

async function getUserRoleById(userId) {
    return new Promise((resolve, reject) => {
        UserRoles.find({user_id: userId}).populate('role_id', 'name')
            .then((result) => {
                resolve(result);
            })
            .catch(reject);
    });
}