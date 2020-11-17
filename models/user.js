const mongoose = require("mongoose");
const joi = require("joi");

function validateUser(user) {
  const schema = {
    name: joi.string().min(2).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).max(18).required(),
  };

  return joi.validate(user, schema);
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, minlength: 4, maxlength: 18, required: true },
});

const User = new mongoose.model("user", userSchema);

module.exports = {
  User,
  validate: validateUser,
};
