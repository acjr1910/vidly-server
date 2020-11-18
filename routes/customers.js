const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const { Customer, validate } = require('../models/customer')

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort('name')
    res.send(customers)
  } catch (e) {
    res.send('There was a problem loading customers', e)
  }
})

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(404).send(error.details[0].message)

  const { isGold, name, phone } = req.body
  const newCustomer = new Customer({
    isGold,
    name,
    phone,
  })
  try {
    const response = await newCustomer.save()
    console.log('Create new customer', response)
    res.send(response)
  } catch (e) {
    res.status(404).send('There was a problem creating new customer')
  }
})

module.exports = router
