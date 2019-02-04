var request = require('request-promise');
var params = require("../config/nseApi");
var cheerio = require("cheerio");
var fs = require('fs');
var extract = require('extract-zip')
var uuid = require('uuid/v4');
var locations = require('../config/locations');
var path = require('path');
var ingest = require('./ingest');

module.exports = {
    downloadFileFromNSE: function (link) {
        let archive = uuid();
        if (link === null){
            return "Report not available for given Date"
        }
        request({
                method: "GET",
                baseUrl: params.baseUrl,
                uri: link,
            }).pipe(fs.createWriteStream(path.join(locations.download,archive)))
            .on('close', function () {
                console.log('Archive Downloaded');
                module.exports.extractFilesFromZip(path.join(locations.download,archive),locations.download);
              });
              return('Downloaded and written');
    },
    downloadReport: function (forDate) {
        request({
                method: "GET",
                baseUrl: params.baseUrl,
                uri: params.uri,
                qs: {
                    h_filetype: params.fileType,
                    section: params.section,
                    date: forDate
                },
            })
            .then(function (response) {
                // Find the download link and fetch it
               return module.exports.downloadFileFromNSE(cheerio.load(response)("a").attr("href"));
            })
            .catch(function (err) {
                // Deal with the error
                console.error(err)
                return null;
            })
    },
    extractFilesFromZip: (fileName, extractTo) => {
        var files = [];
        extract(fileName, {dir: extractTo, onEntry: (entry, zipFile) =>{
            files.push(entry.fileName);
        }}, err => {
            if(err){
                console.error("Error extracting file");
            } else{
                fs.unlink(fileName);
                console.log("Archive extacted and removed.");
                files.forEach(entry => ingest(entry))
            }
        });
    }
}