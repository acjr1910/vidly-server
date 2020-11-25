const mongoose = require('mongoose')
const joi = require('joi')
const moment = require('moment')

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 10,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
})

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId,
  })
}

rentalSchema.methods.return = function () {
  this.dateReturned = new Date()

  const rentalDays = moment().diff(this.dateOut, 'days')
  this.rentalFee = rentalDays * this.movie.dailyRentalRate
}

function validateRentals(rental) {
  const clientSchema = {
    customerId: joi.objectId().required(),
    movieId: joi.objectId().required(),
  }

  return joi.validate(rental, clientSchema)
}

const Rental = new mongoose.model('rental', rentalSchema)

module.exports = {
  Rental,
  validate: validateRentals,
}
