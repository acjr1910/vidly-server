const router = require('express').Router()
const joi = require('joi')

const { Rental } = require('../models/rental')
const { Movie } = require('../models/movie')
const auth = require('../middleware/auth')
const validate = require('../middleware/validate')

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

  if (!rental) return res.status(404).send('Rental not found')

  if (rental.dateReturned)
    return res.status(400).send('Return already processed')

  rental.return()
  await rental.save()

  await Movie.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  )

  return res.send(rental)
})

function validateReturn(req) {
  const schema = {
    customerId: joi.objectId().required(),
    movieId: joi.objectId().required(),
  }

  return joi.validate(req, schema)
}

module.exports = router
