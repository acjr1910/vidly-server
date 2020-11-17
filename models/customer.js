const mongoose = require("mongoose");
const joi = require("joi");

function validateCustomer(reqBody) {
  const genreSchema = {
    isGold: joi.boolean().required(),
    name: joi.string().min(3).required(),
    phone: joi.string().min(5).max(12).required(),
  };

  return joi.validate(reqBody, genreSchema);
}

const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, require: true },
  name: { type: String, require: true, minlength: 3, maxlength: 50 },
  phone: { type: String, required: true, minlength: 5, maxlength: 12 },
});

const Customer = mongoose.model("customer", customerSchema);

module.exports = {
  Customer,
  validate: validateCustomer,
};
