const mongoose = require("mongoose");
const joi = require("joi");

function validateGenre(genre) {
  const schema = {
    name: joi.string().min(3).required(),
  };

  return joi.validate(genre, schema);
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
