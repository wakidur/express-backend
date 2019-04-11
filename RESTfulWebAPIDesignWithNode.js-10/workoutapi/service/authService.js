const config = require('../config/config');
const jwt = require('jsonwebtoken');
const Role = require('../config/role');

// users hardcoded for simplicity, store in a db for production applications
const users = [{
        id: 1,
        username: 'admin',
        password: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        role: Role.Admin
    },
    {
        id: 2,
        username: 'user',
        password: 'user',
        firstName: 'Normal',
        lastName: 'User',
        role: Role.User
    }
];