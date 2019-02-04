var csv = require("fast-csv");
var locations = require("../config/locations");
var path = require("path");
var fs = require("fs");
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

module.exports =(file) => {
    var csvfile = path.join(locations.download, file);
    var stream = fs.createReadStream(csvfile);
    var Record = mongoose.model("Report");
    var csvStream = csv()
      .on("data", data => {
        var record = new Record({
          _id: new ObjectId(),
          SYMBOL: data[0],
          SERIES: data[1],
          OPEN: data[2],
          HIGH: data[3],
          LOW: data[4],
          CLOSE: data[5],
          LAST: data[6],
          PREVCLOSE: data[7],
          TOTTRDQTY: data[8],
          TOTTRDVAL: data[9],
          TIMESTAMP: data[10],
          TOTALTRADES: data[11],
          ISIN: data[12],
        });

        record.save(err => {
          // console.log(record);
          if(err){
            console.error(err)
          }
        })

      })
      .on("end", () => {
          fs.unlink(csvfile);
      })
      stream.pipe(csvStream);
  }
