require('dotenv').config();
var express = require('express');
require('./db.js');
var app = express();
var bodyParser = require('body-parser');
const request = require('request');
var db = require('./db.js');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/', function (req, res) {
    var callId = req.body.callId;
    console.log('Calculating for call id' + callId +'started');

    db.calculatePrice(callId).then(function(calculatedPrice){
        request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     process.env.IB_SERVER_URI + '/consume',
            form:    { price: calculatedPrice , callId: callId}
        }, function(error, response, body){
            console.log(body);
        });
    });

});

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port 3003!');
});