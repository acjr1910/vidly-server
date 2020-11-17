const mongoose = require("mongoose");
const Joi = require("joi");

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

const genreSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true },
});

const Genre = new mongoose.model("genre", genreSchema);

module.exports = {
  Genre,
  genreSchema,
  validate: validateGenre,
};
