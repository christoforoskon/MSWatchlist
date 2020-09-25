const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');


//Load Movie Model
require('../models/Movie');
const Movie = mongoose.model('movies')

// Movie Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Movie.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(movies => {
      res.render('movies/index', {
        movies: movies.map(movies => movies.toJSON())
      });
    });
});

// Add Movie Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('movies/add');
});

// Edit Movie Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Movie.findOne({
    _id: req.params.id
  })
    .then(movie => {
      if (movie.user != req.user.id) {
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/movies');
      } else {
        res.render('movies/edit', {
          movie: movie.toJSON()
        });
      }
    });

});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add some details' });
  }
  if (errors.length > 0) {
    res.render('movies/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Movie(newUser)
      .save()
      .then(movie => {
        req.flash('success_msg', 'Movie added');
        res.redirect('/movies');
      })
  }
})

// Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Movie.findOne({
    _id: req.params.id
  })
    .then(movie => {
      //new values
      movie.title = req.body.title;
      movie.details = req.body.details;

      movie.save()
        .then(movie => {
          req.flash('success_msg', 'Movie updated');
          res.redirect('/movies');
        })
    });
});

// Delete Movie
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Movie.deleteOne({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'The movie has been removed');
      res.redirect('/movies');
    });
});

module.exports = router;