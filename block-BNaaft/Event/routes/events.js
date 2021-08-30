var express = require('express');
var router = express.Router();
let _ = require('lodash');
let url = require('url');
let qs = require('querystring');
var Event = require('../models/event');
var Remark = require('../models/remark');

/* GET events listing. */

router.get('/', function (req, res, next) {
  Event.find({}, (err, events) => {
    if (err) return next(err);
    //arr for array of categories

    let arr = events.map((ele) => {
      return ele.category;
    });
    arr = _.flattenDeep(arr);
    arr = _.uniq(arr);
    // arrLocations for array of locations

    let arrLocations = events.map((ele) => {
      return ele.location.trim();
    });
    arrLocations = _.flattenDeep(arrLocations);
    arrLocations = _.uniq(arrLocations);

    res.render('events', { events, arr, arrLocations });
  });
});

router.get('/new', function (req, res, next) {
  res.render('addEvent');
});

router.post('/new', (req, res) => {
  let data = req.body;
  let arr = data.category.split(',').map((ele) => {
    return ele.trim();
  });
  data.category = arr;
  Event.create(data, (err, createdevent) => {
    if (err) return next(err);
    res.redirect('/events');
  });
});

// event details

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

// edit event

router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id;

  Event.findById(id, (err, event) => {
    if (err) return next(err);
    res.render('editEventForm', { event });
  });
});

router.post('/:id', (req, res) => {
  var id = req.params.id;
  let data = req.body;
  let arr = data.category.split(',').map((ele) => {
    return ele.trim();
  });
  data.category = arr;
  // req.body.category = req.body.category.split(' ');
  Event.findByIdAndUpdate(id, data, (err, updatedEvent) => {
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

//Sorting By tags

router.get('/sort/tags', (req, res, next) => {
  console.log(req.query);
  let parsedUrl = url.parse(req.url);
  let queryObj = qs.parse(parsedUrl.query);
  console.log(queryObj.name);

  Event.find({ category: queryObj.name }, (err, events) => {
    if (err) return next(err);
    Event.find({}, (err, dummy) => {
      if (err) return next(err);

      //arr for array of categories

      let arr = dummy.map((ele) => {
        return ele.category;
      });
      arr = _.flattenDeep(arr);
      arr = _.uniq(arr);

      // arrLocations for array of locations

      let arrLocations = dummy.map((ele) => {
        return ele.location.trim();
      });
      arrLocations = _.flattenDeep(arrLocations);
      arrLocations = _.uniq(arrLocations);

      res.render('events', { events, arr, arrLocations });
    });
  });
});

//sorting by locations

router.get('/sort/location', (req, res, next) => {
  let parsedUrl = url.parse(req.url);
  let queryObj = qs.parse(parsedUrl.query);
  console.log(queryObj.name);

  Event.find({ location: queryObj.name }, (err, events) => {
    if (err) return next(err);
    Event.find({}, (err, dummy) => {
      if (err) return next(err);

      //arr for array of categories

      let arr = dummy.map((ele) => {
        return ele.category;
      });
      arr = _.flattenDeep(arr);
      arr = _.uniq(arr);

      // arrLocations for array of locations

      let arrLocations = dummy.map((ele) => {
        return ele.location.trim();
      });
      arrLocations = _.flattenDeep(arrLocations);
      arrLocations = _.uniq(arrLocations);

      res.render('events', { events, arr, arrLocations });
    });
  });
});

router.get('/sort/date/:type', (req, res, next) => {
  let type = req.params.type;

  //for sorting in accending order
  if (type === 'acc') {
    Event.find({})
      .sort({ start_date: 1 })
      .exec((err, events) => {
        if (err) return next(err);

        Event.find({}, (err, dummy) => {
          if (err) return next(err);

          //arr for array of categories

          let arr = dummy.map((ele) => {
            return ele.category;
          });
          arr = _.flattenDeep(arr);
          arr = _.uniq(arr);

          // arrLocations for array of locations

          let arrLocations = dummy.map((ele) => {
            return ele.location.trim();
          });
          arrLocations = _.flattenDeep(arrLocations);
          arrLocations = _.uniq(arrLocations);

          res.render('events', { events, arr, arrLocations });
        });
      });
  } else if (type === 'dec') {
    //for sorting in secending order
    Event.find({})
      .sort({ start_date: -1 })
      .exec((err, events) => {
        if (err) return next(err);

        Event.find({}, (err, dummy) => {
          if (err) return next(err);

          //arr for array of categories

          let arr = dummy.map((ele) => {
            return ele.category;
          });
          arr = _.flattenDeep(arr);
          arr = _.uniq(arr);

          // arrLocations for array of locations

          let arrLocations = dummy.map((ele) => {
            return ele.location.trim();
          });
          arrLocations = _.flattenDeep(arrLocations);
          arrLocations = _.uniq(arrLocations);
          res.render('events', { events, arr, arrLocations });
        });
      });
  } else {
    next();
  }
});

// test

// function handleDefaultData(category) {
//   Event.find({ event_category: category }, (err, events) => {
//     if (err) return next(err);
//     Event.find({}, (err, dummy) => {
//       if (err) return next(err);

//       //arr for array of categories

//       let arr = dummy.map((ele) => {
//         return ele.event_category;
//       });
//       arr = _.flattenDeep(arr);
//       arr = _.uniq(arr);

//       // arrLocations for array of locations

//       let arrLocations = dummy.map((ele) => {
//         return ele.location.trim();
//       });
//       arrLocations = _.flattenDeep(arrLocations);
//       arrLocations = _.uniq(arrLocations);

//       res.render('eventList', { events, arr, arrLocations });
//     });
//   });
// }

module.exports = router;
