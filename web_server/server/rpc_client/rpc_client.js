const { log } = require('har-validator');
var jayson = require('jayson');

var client = jayson.client.http('http://localhost:4040/api');

// Test RPC method
function add(a, b, callback) {
    client.request('add', [a, b], function (err, error, response) {
        if (err) throw err;
        console.log(response);
        callback(response);
    });
}
function getNewsSummariesForUser(user_id, page_num, callback) {
    client.request('getNewsSummariesForUser', [user_id, page_num], function (err, error, response) {
        if (err) {
            throw err;
        }
        console.log(response);
        callback(response);
    })
}
function getLikedNewsSummariesForUser(user_id, page_num, callback) {
    client.request('getLikedNewsSummariesForUser', [user_id, page_num], function (err, error, response) {
        if (err) {
            throw err;
        }
        console.log(response);
        callback(response)
    })
}
function getRecommendNewsSummariesForUser(user_id, page_num, callback) {
    client.request('getRecommendNewsSummariesForUser', [user_id, page_num], function (err, error, response) {
        if (err) {
            throw err;
        }
        console.log(response);
        callback(response)
    })
}

function getSpecialNewsSummariesForUser(user_id, category, page_num, callback) {
    client.request('getSpecialNewsSummariesForUser', [user_id, category, page_num], function (err, error, response) {
        if (err) {
            throw err;
        }
        console.log(response);
        callback(response);
    })
    console.log("getting special news")
    console.log("!!!!!!!!!!!!!!!!!!!!!!")
}

function logNewsClickForUser(user_id, news_id) {
    client.request('logNewsClickForUser', [user_id, news_id], function (err, error, response) {
        if (err) {
            throw err;
        }
        console.log(response);
    })
}
function like(user_id,news_id){
    client.request('like', [user_id, news_id], function (err, error, response) {
        console.log(user_id)
        if (err) {
            throw err;
        }
        console.log(response);
    })
}

function getUserInfo(user_id, callback) {
    // console.log("hello world")
    client.request('getUserInfo', [user_id], function (err, error, response) {
        if (err) {
            throw err;
        }
        console.log(response);
        callback(response)
    }) 
}
function updateUserInfo(user_id, user_info, attr) {
    client.request('updateUserInfo', [user_id, user_info, attr], function(err, error, response){
        if (err) {
            throw err;
        }
        console.log(response);
    }) 
}


function getLikeForUser(user_id, page_num, callback) {
    client.request('getLikeForUser', [user_id, page_num], function (err, error, response) {
        if (err) {
            throw err;
        }
        console.log(response);
        callback(response);
    })
}

module.exports = {
    add: add,
    getNewsSummariesForUser: getNewsSummariesForUser,
    logNewsClickForUser,
    like,
    getUserInfo,
    updateUserInfo,
    getLikedNewsSummariesForUser,
    getRecommendNewsSummariesForUser,
    getLikeForUser,
    getSpecialNewsSummariesForUser,
}