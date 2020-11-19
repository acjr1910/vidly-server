require('express-async-errors')
const winston = require('winston')
require('winston-mongodb')
const config = require('config')
const mongoose = require('mongoose')
const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)

const express = require('express')
const app = express()

require('./startup/routes')(app)

winston.exceptions.handle(
  new winston.transports.File({ filename: 'uncaughtExceptions.log' })
)

process.on('unhandledRejection', (ex) => {
  throw ex
})

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

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
