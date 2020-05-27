var express = require('express');
var router = express.Router();
const rooms = require('../socketApi').rooms;

//console.log('exportowane pokoje z socketApi do index.js - test-  ', rooms)


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'type name and choose playin room', rooms });
});



module.exports = router;
