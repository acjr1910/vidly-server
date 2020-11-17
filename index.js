const express = require("express");
const app = express();
const mongoose = require("mongoose");

const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect("mongodb://localhost/vidly", mongooseOptions)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log("Could not connect to MongoDB", error));

app.use(express.json());

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
