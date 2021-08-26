var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Remark = require('../models/remark');

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

// router.get('/:id', (req, res, next) => {
//   var id = req.params.id;
//   Event.findById(id, (err, event) => {
//     if (err) return next(err);
//     res.render('eventDetails', { event: event });
//   });
// });

router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  Event.findById(id)
    .populate('remarks')
    .exec((err, event) => {
      if (err) return next(err);
      console.log(event);
      res.render('eventDetails', { event });
    });
});

router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id;
  Event.findById(id, (err, event) => {
    event.category = event.category.join(' ');
    if (err) return next(err);
    res.render('editEventForm', { event });
  });
});

router.post('/:id', (req, res) => {
  var id = req.params.id;
  req.body.category = req.body.category.split(' ');
  Event.findByIdAndUpdate(id, req.body, (err, updatedEvent) => {
    if (err) return next(err);
    res.redirect('/events/' + id);
  });
});

router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id;
  Event.findByIdAndDelete(id, (err, event) => {
    if (err) return next(err);
    res.redirect('/events');
  });
});

router.get('/:id/likes', (req, res) => {
  var id = req.params.id;
  Event.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, event) => {
    if (err) return next(err);
    res.redirect('/events/' + id);
  });
});

router.get('/:id/dislikes', (req, res) => {
  var id = req.params.id;
  Event.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, event) => {
    if (err) return next(err);
    res.redirect('/events/' + id);
  });
});

router.post('/:eventId/remarks', (req, res, next) => {
  var eventId = req.params.eventId;
  console.log(req.body);
  req.body.eventId = eventId;
  Remark.create(req.body, (err, remark) => {
    if (err) return next(err);
    Event.findByIdAndUpdate(
      eventId,
      { $push: { remarks: remark.id } },
      (err, remark) => {
        if (err) return next(err);
        res.redirect('/events/' + eventId);
      }
    );
  });
});

module.exports = router;
