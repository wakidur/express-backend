const mongoose = require('mongoose');
const Durations = require('../model/durationsSchema');

async function getAllDurationsPromise(userInfo) {
    return new Promise((resolve, reject) => {
        Durations.find({})
            .then((result) => resolve(result))
            .catch(reject);
    });
 }

 async function saveDurationsPromise(userInfo) {
    const durations = new Durations(userInfo);
    return new Promise((resolve, reject) => {
        durations.save()
            .then((result) => resolve(result))
            .catch(reject)
    });
 }

module.exports = {
    getAllDurationsPromise,
    saveDurationsPromise
   
};