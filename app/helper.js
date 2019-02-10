var request = require('request-promise');
var params = require("../config/nseApi");
var cheerio = require("cheerio");
var fs = require('fs');
var extract = require('extract-zip')
var uuid = require('uuid/v4');
var locations = require('../config/locations');
var path = require('path');
var ingest = require('./ingest');
var mongoose = require('mongoose');
var moment = require('moment');

module.exports = {
  downloadFileFromNSE: function (link, forDate) {
    let archive = uuid() + "-" + forDate;
    if (link === null) {
      console.log("Report not available for ", forDate);
      return;
    }
    request({
        method: "GET",
        baseUrl: params.baseUrl,
        uri: link,
      }).pipe(fs.createWriteStream(path.join(locations.download, archive)))
      .on('close', function () {
        console.log('Archive Downloaded for', forDate);
        module.exports.extractFilesFromZip(path.join(locations.download, archive), locations.download, forDate);
      });
  },
  downloadReport: function (forDate) {
    return request({
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
        let uri = cheerio.load(response)("a").attr("href");
        if (uri) {
          module.exports.downloadFileFromNSE(uri, forDate)
        } else {
          console.log("Report not available for " + forDate);
        }
      })
      .catch(function (err) {
        // Deal with the error
        console.error(err)
      })
  },
  extractFilesFromZip: (fileName, extractTo, forDate) => {
    var files = [];
    extract(fileName, {
      dir: extractTo,
      onEntry: (entry, zipFile) => {
        files.push(entry.fileName);
      }
    }, (err) => {
      if (err) {
        console.error("Error extracting file");
      } else {
        fs.unlink(fileName, () => console.log("Archive extacted and removed for", forDate));

        files.forEach(entry => ingest(entry, forDate))
      }
      module.exports.addIngestionStatus(forDate);
    });
  },
  
  checkReportInDb: (forDate) => {
    var Ingestion = mongoose.model("Ingestion");

    var query = Ingestion.where({
      DATE_PARAM: forDate
    });
    
    query.findOne((err, ingestion) => {
      if (err) {
        throw err;
      }
      if (!ingestion) {
        console.log("No Ingestion Record for " + forDate);
        module.exports.downloadReport(forDate, module.exports.add)
      } else {
        console.log("Already Ingested on " + ingestion.INGESTED_ON);
      }
    })
  },

  addIngestionStatus: (forDate) => {
    var Ingestion = mongoose.model("Ingestion");

    var ingestion = new Ingestion({
      DATE_PARAM: forDate,
      DATE_FOR: moment(forDate, "DD-MM-YYYY").toISOString(),
      INGESTED_ON: new Date(),
    });

    ingestion.save((err) => {
      if (err) {
        console.error(err)
      } else {
        console.log("Ingestion complete for", forDate)
      }
    })
  }

}
