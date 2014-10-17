"use strict";

var http = require('http');
var json2csv = require('json2csv');
var fs = require('fs');

http.createServer(function (request, response) {

    //console.log("request received");

    var postData_str = 'empty';
    request.addListener("data", function (chunk) {
        // called when a new chunk of data was received
        postData_str += chunk;
    });
    request.addListener("end", function () {

        console.log(postData_str);
        //var postData_jsonObj = JSON.parse(postData_str);

        //json2csv({
            //data: postData_jsonObj,
            //fields: ['timestamp', 'event', 'btn', 'x', 'y', 'el']
        //}, function (err, csv) {
            //if (err) {
                //console.log(err);
            //}
            //fs.appendFile('trackinglog.txt', csv, function (err) {
                //console.log("error writing to file: " + err);
            //});
        //});

        response.setHeader("Content-Type", "text/plain");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
        //response.writeHead(200, {
        //"Content-Type": "text/html",
        //"Access-Control-Allow-Origin": "*"
        //});
        response.write("ok");
        response.end();
    });
}).listen(8080);

console.log("starting server on port 8080...");
