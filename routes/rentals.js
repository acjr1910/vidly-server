const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rental");

const mongoose = require("mongoose");
const Fawn = require("fawn");
const router = require("express").Router();

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { movieId, customerId } = req.body;

  const customer = await Customer.findById(customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(movieId);
  if (!movie) res.send("Invalid movie");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
  } catch (e) {
    res.status(500).send("Something failed");
  }

  res.send(rental);
});

module.exports = router;
