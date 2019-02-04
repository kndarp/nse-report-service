var mongoose = require("mongoose");

var nseBhavCopySchema = mongoose.Schema({
    SYMBOL : String,
    SERIES : String,
    OPEN : mongoose.Schema.Types.Decimal128,
    HIGH : mongoose.Schema.Types.Decimal128,
    LOW : mongoose.Schema.Types.Decimal128,
    CLOSE : mongoose.Schema.Types.Decimal128,
    LAST : mongoose.Schema.Types.Decimal128,
    PREVCLOSE : mongoose.Schema.Types.Decimal128,
    TOTTRDQTY : Number,
    TOTTRDVAL : mongoose.Schema.Types.Decimal128,
    TIMESTAMP: Date,
    TOTALTRADES: Number,
    ISIN : String
});

module.exports = mongoose.model("Report", nseBhavCopySchema);
