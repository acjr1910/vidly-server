const _ = require('lodash')
const joi = require('joi')
const bcrypt = require('bcrypt')
const { User } = require('../models/user')
const router = require('express').Router()

router.get('/', async (req, res) => {
  const users = await User.find()
  return res.send(users)
})

router.post('/', async (req, res) => {
  const { error } = validate(req)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Invalid email or password.')

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid email or password.')

  const token = user.generateAuthToken()
  res.send(token)
})

function validate(req) {
  const schema = {
    email: joi.string().min(5).max(255).email().required(),
    password: joi.string().min(5).max(255).required(),
  }

  return joi.validate(req.body, schema)
}

module.exports = router
