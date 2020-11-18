const config = require('config')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { User, validate } = require('../models/user')
const router = require('express').Router()

router.get('/', async (req, res) => {
  const users = await User.find()
  return res.send(users)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let newUser = await User.findOne({ email: req.body.email })
  if (newUser) return res.status(400).send('User already registred.')

  newUser = new User(_.pick(req.body, ['name', 'email', 'password']))
  const salt = await bcrypt.genSalt(10)
  newUser.password = await bcrypt.hash(newUser.password, salt)

  try {
    await newUser.save()
    const token = jwt.sign({ _id: newUser._id }, config.get('jwtPrivateKey'))
    res
      .header('x-auth-token', token)
      .send(_.pick(req.body, ['_id', 'name', 'email']))
  } catch (e) {
    res.status(400).send(e)
  }
})

module.exports = router
