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
function getSpecialNewsSummariesForUser(user_id, category, page_num, callback) {
    client.request('getSpecialNewsSummariesForUser', [user_id, category, page_num], function (err, error, response) {
        if (err) {
            throw err;
        }
        console.log(response);
        callback(response);
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

module.exports = {
    add: add,
    getNewsSummariesForUser: getNewsSummariesForUser,
    logNewsClickForUser,
    like
}