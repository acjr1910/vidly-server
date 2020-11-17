const router = require("express").Router();
const mongoose = require("mongoose");
const { Movie } = require("../models/movie");
const { Rental, validate } = require("../models/rental");

router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) res.send("No rentals of the given movieId were found");

  let rental = new Rental({
    movie: {
      title: movie.title,
      genre: movie.genre,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  rental = await rental.save();
  res.send(rental);
});

module.exports = router;
