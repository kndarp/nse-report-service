var express = require('express');
var router = express.Router();
var helper = require('../app/helper');
var backfill = require('./../app/backfill');

/* GET endpoints */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* GET report by date*/
router.get('/date/:date', function (req, res, next) {
  helper.checkReportInDb(req.params.date)
  res.send("Acknowledged - "+new Date())
});

router.get('/backfill', function (req,res,next) {
  backfill.backfill();  
  res.send("Acknowledged - "+new Date())
});

module.exports = router;