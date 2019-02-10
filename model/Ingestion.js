var mongoose = require("mongoose");

var ingestionSchema = mongoose.Schema({
    DATE_PARAM : String,
    DATE_FOR : Date,
    INGESTED_ON : Date,
});

module.exports = mongoose.model("Ingestion", ingestionSchema);
