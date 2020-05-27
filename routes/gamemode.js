var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

const {username, room} = req.query;
  res.render('game', {username, room});
});

module.exports = router;
