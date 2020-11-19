require('express-async-errors')
const winston = require('winston')
require('winston-mongodb')
const config = require('config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)

const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')

const error = require('./middleware/error')

winston.add(new winston.transports.File({ filename: 'logfile.log' }))
winston.add(
  new winston.transports.MongoDB({
    db: 'mongodb://localhost/vidly',
    level: 'info',
  })
)

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1)
}

const mongooseOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
mongoose
  .connect('mongodb://localhost/vidly', mongooseOptions)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((error) => console.log('Could not connect to MongoDB', error))

app.use(express.json())
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)

app.use(error)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
