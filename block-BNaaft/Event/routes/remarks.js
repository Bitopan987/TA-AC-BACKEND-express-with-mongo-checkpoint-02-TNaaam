var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Remark = require('../models/remark');

/* GET home page. */

router.get('/:remarkId/edit', (req, res, next) => {
  var remarkId = req.params.remarkId;
  Remark.findById(remarkId, (err, remark) => {
    if (err) return next(err);
    res.render('editRemark', { remark });
  });
});

router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Remark.findByIdAndUpdate(id, req.body, (err, remark) => {
    if (err) return next(err);
    res.redirect('/events/' + remark.eventId);
  });
});

router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id;
  Remark.findByIdAndDelete(id, (err, remark) => {
    if (err) return next(err);
    Event.findByIdAndUpdate(
      remark.eventId,
      { $pull: { remarks: remark.id } },
      (err, event) => {
        if (err) return next(err);
        res.redirect('/events/' + remark.eventId);
      }
    );
  });
});

// router.get('/:id/likes/inc', (req, res) => {
//   var id = req.params.id;
//   Remark.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, event) => {
//     if (err) return next(err);
//     res.redirect('/events/' + id);
//   });
// });

// router.get('/:id/dislikes/dec', (req, res) => {
//   var id = req.params.id;
//   Event.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, event) => {
//     if (err) return next(err);
//     res.redirect('/events/' + id);
//   });
// });

router.get('/:id/likes/inc', function (req, res, next) {
  let remarksId = req.params.id;

  Remark.findByIdAndUpdate(remarksId, { $inc: { likes: 1 } }, (err, remark) => {
    if (err) return next(err);

    res.redirect('/events/' + remark.eventId);
  });
});

router.get('/:id/likes/dec', function (req, res, next) {
  let remarksId = req.params.id;

  Remark.findByIdAndUpdate(
    remarksId,
    { $inc: { likes: -1 } },
    (err, remark) => {
      if (err) return next(err);
      res.redirect('/events/' + remark.eventId);
    }
  );
});

module.exports = router;
