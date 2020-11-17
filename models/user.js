const mongoose = require("mongoose");
const joi = require("joi");

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 5, maxlength: 50, required: true },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true,
  },
  password: { type: String, minlength: 5, maxlength: 1024, required: true },
});

function validateUser(user) {
  const schema = {
    name: joi.string().min(5).max(50).required(),
    email: joi.string().min(5).max(255).email().required(),
    password: joi.string().min(5).max(255).required(),
  };

  return joi.validate(user, schema);
}

const User = new mongoose.model("user", userSchema);

module.exports = {
  User,
  validate: validateUser,
};
