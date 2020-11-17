const mongoose = require("mongoose");
const joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: genreSchema,
    require: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

function validateMovie(movie) {
  const schema = {
    title: joi.string().min(5).max(50).required(),
    genreId: joi.string().required(),
    numberInStock: joi.number().min(0).required(),
    dailyRentalRate: joi.number().min(0).required(),
  };

  return joi.validate(movie, schema);
}

const Movie = new mongoose.model("movie", movieSchema);

module.exports = {
  Movie,
  movieSchema,
  validate: validateMovie,
};
