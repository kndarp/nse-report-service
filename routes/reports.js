var express = require('express');
var router = express.Router();
var helper = require('../app/helper');

/* GET endpoints */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* GET report by date*/
router.get('/date/:date', function (req, res, next) {
  console.log('Router - '+helper.downloadReport(req.params.date))
  res.send("Queued");

});

module.exports = router;