var express = require('express');
var router = express.Router();
var helper = require('../middleware/helper');
var request = require('request-promise');
var params = require("../config/nseApi");

/* GET endpoints */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* GET report by date*/
router.get('/date/:date', function (req, res, next) {

  res.send(helper.downloadReport(req.params.date));

});

module.exports = router;