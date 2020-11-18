const _ = require('lodash')
const bcrypt = require('bcrypt')
const { User, validate } = require('../models/user')
const router = require('express').Router()
const auth = require('../middleware/auth')

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  return res.send(user)
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
    const token = newUser.generateAuthToken()
    await newUser.save()
    res
      .header('x-auth-token', token)
      .send(_.pick(req.body, ['_id', 'name', 'email']))
  } catch (e) {
    res.status(400).send(e)
  }
})

module.exports = router
