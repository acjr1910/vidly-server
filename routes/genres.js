const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Genre, validate } = require("../models/genre");

async function getGenres() {
  const genres = await Genre.find().sort("name");
  return genres;
}

router.get("/", async (req, res) => {
  res.send(await getGenres());
});

async function createGenre(name) {
  const genre = new Genre({
    _id: new mongoose.mongo.ObjectId(),
    name,
  });

  try {
    const result = await genre.save();
    console.log("Created new genre:", result);
  } catch (ex) {
    for (field in ex.errors) {
      console.log("error:", ex.errors[field].message);
    }
  }
}

router.post("/", (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const name = req.body.name;

  const genre = {
    id: genres.length + 1,
    name,
  };

  genres.push(genre);
  createGenre(name);
  res.send(genre);
});

async function updateGenreName(id, name) {
  const course = await Genre.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
      },
    },
    { new: true }
  );

  console.log(course);
}

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const genres = await getGenres();

  const genre = genres.find((g) => g._id == id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const updatedGenre = await updateGenreName(id, name);

  res.send(updatedGenre);
});

async function removeGenre(id) {
  const result = await Genre.deleteOne({ _id: id });
  console.log(result);
}

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).send("No ID was given.");

  res.send(await removeGenre(id));
});

async function getGenre(id) {
  const genre = await Genre.findOne({
    _id: id,
  });

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  return genre;
}

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).send("No ID was given.");

  res.send(await getGenre(id));
});

module.exports = router;
