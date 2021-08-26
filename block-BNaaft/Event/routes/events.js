var express = require('express');
var router = express.Router();
var Event = require('../models/event');

/* GET events listing. */

router.get('/', function (req, res, next) {
  Event.find({}, (err, events) => {
    if (err) return next(err);
    res.render('events', { events: events });
  });
});

router.get('/new', function (req, res, next) {
  res.render('addEvent');
});

router.post('/', (req, res) => {
  Event.create(req.body, (err, createdevent) => {
    if (err) return next(err);
    res.redirect('/events');
  });
});

module.exports = router;
