var request = require('request-promise');
var params = require("../config/nseApi");
var cheerio = require("cheerio");
var fs = require('fs');
var extract = require('extract-zip')
const uuid = require('uuid/v4');

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
            }).pipe(fs.createWriteStream(archive))
            .on('close', function () {
                console.log('Downloaded and written');
                module.exports.extractFilesFromZip(archive,__dirname);
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
        extract(fileName, {dir: extractTo}, err => console.error);
        // fs.unlink(fileName);
    }
}