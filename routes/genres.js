const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')

const { Genre, validate } = require('../models/genre')

router.get('/', async (req, res) => {
  res.send(await Genre.find().sort('name'))
})

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const name = req.body.name

  const genre = new Genre({
    _id: new mongoose.mongo.ObjectId(),
    name,
  })

  try {
    const result = await genre.save()
    res.send(result)
  } catch (ex) {
    for (field in ex.errors) {
      res.send(ex.errors[field].message)
    }
  }
})

async function updateGenreName(id, name) {
  const course = await Genre.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
      },
    },
    { new: true }
  )

  console.log(course)
}

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  const genres = await Genre.find().sort('name')

  const genre = genres.find((g) => g._id == id)

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.')

  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const updatedGenre = await updateGenreName(id, name)

  res.send(updatedGenre)
})

async function removeGenre(id) {
  const result = await Genre.deleteOne({ _id: id })
  console.log(result)
}

router.delete('/:id', [auth, admin], async (req, res) => {
  const { id } = req.params
  if (!id) return res.status(404).send('No ID was given.')

  res.send(await removeGenre(id))
})

router.get('/:id', validateObjectId, async (req, res) => {
  const { id } = req.params

  if (!id) return res.status(404).send('No ID was given.')

  const genre = await Genre.findOne({
    _id: id,
  })

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.')

  res.send(genre)
})

module.exports = router
