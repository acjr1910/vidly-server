const router = require("express").Router();
const mongoose = require("mongoose");

const { Genre } = require("../models/genre");
const { Movie, validate } = require("../models/movie");

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort("title");
    return res.send(movies);
  } catch (e) {
    res.send("There was a problem loading movies");
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre ID.");

  const { title, numberInStock, dailyRentalRate } = req.body;
  const movie = new Movie({
    title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock,
    dailyRentalRate,
  });
  movie.save();
  res.send(movie);
});

module.exports = router;
