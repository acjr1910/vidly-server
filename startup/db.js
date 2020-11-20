const winston = require('winston')
const mongoose = require('mongoose')

module.exports = async function () {
  await mongoose
    .connect('mongodb://localhost/vidly', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => winston.info('DB connected'))
}
