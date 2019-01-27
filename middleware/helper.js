var request = require('request-promise');
var params = require("../config/nseApi");
var cheerio = require("cheerio");

module.exports = {
    downloadFileFromNSE: function (link) {
        request({
                method: "GET",
                baseUrl: params.baseUrl,
                uri: link,
                encoding: "binary",
  
            })
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.error(error);
                return null;
            })
    },

    getDownloadLink: function (forDate) {
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
                // Handle the response
                redirectUri = cheerio.load(response)("a").attr("href").toString();
                console.log(redirectUri);
                return (module.exports.downloadFileFromNSE(redirectUri));
            })
            .catch(function (err) {
                // Deal with the error
                console.error(err)
                return "/";
            })
    },

    downloadReport: function(forDate){
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
                module.exports.downloadFileFromNSE(cheerio.load(response)("a").attr("href"));
            })
            .catch(function (err) {
                // Deal with the error
                console.error(err)
                return "/";
            })
    }
}