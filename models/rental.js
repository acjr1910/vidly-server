const mongoose = require("mongoose");
const joi = require("joi");
const { movieSchema } = require("./movie");

function validateRentals(rental) {
  const clientSchema = {
    movieId: joi.string().required(),
  };

  return joi.validate(rental, clientSchema);
}

const rentalSchema = new mongoose.Schema({
  movie: {
    type: movieSchema,
    required: true,
  },
});

const Rental = new mongoose.model("rental", rentalSchema);

module.exports = {
  Rental,
  validate: validateRentals,
};
