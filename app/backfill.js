var helper =  require("./helper");
var moment =  require('moment');
var mongoose =  require('mongoose');

module.exports = {
  backfill: () => {
      console.log(process.env.RETENTION);
    let retentionDays = process.env.RETENTION;
    let today = moment(new Date);
    let lastDay = moment(new Date).subtract(retentionDays, 'days');
    
    var Ingestion = mongoose.model("Ingestion");

    Ingestion.find({
      DATE_FOR: {
        $gt: lastDay.toISOString(),
        $lt: today.toISOString()
      }
    }, 'DATE_PARAM', (err, docs) => {
        if(err){
            console.error(err);
        }
        
        ingestedDates = docs.map(doc =>{
          return doc.DATE_PARAM;
        }); 
        console.log("Ingested dates : ", ingestedDates);
        
        while(lastDay.isSameOrBefore(today,'day')) {
          
          lastDay.add(1,'days');
          
          let dateParam = lastDay.format("DD-MM-YYYY");
          if(ingestedDates.includes(dateParam)){
            console.log("Data already ingested for", dateParam);
            continue;
          }
          console.log("Checking for", dateParam);
          helper.downloadReport(dateParam);
        };
        console.log("All Queued.");
        
    })
  }
}
