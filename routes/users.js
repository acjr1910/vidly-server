const { User, validate } = require("../models/user");
const router = require("express").Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  return res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;

  let newUser = await User.findOne({ email });
  if (newUser) return res.status(400).send("User already registred.");

  newUser = new User({
    name,
    email,
    password,
  });

  try {
    await newUser.save();
    res.send(newUser);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
