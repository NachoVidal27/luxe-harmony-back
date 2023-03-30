const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");

// Display a listing of the resource.
async function index(req, res) {
  const users = await User.find();
  res.json(users);
}

// Display the specified resource.
async function show(req, res) {
  const userId = req.params.id;
  const user = await User.findById(userId).populate("orders");
  res.json(user);
}

// Show the form for creating a new resource
async function create(req, res) {
  const bodyData = req.body;
  const newUser = await User.create({
    firstname: bodyData.firstname,
    lastname: bodyData.lastname,
    password: await bcrypt.hash(`${bodyData.password}`, 8),
    email: bodyData.email,
    addresses: bodyData.addresses,
  });
  res.json(newUser);
}

// Show the form for editing the specified resource.
async function edit(req, res) {
  const bodyData = req.body;
  const userId = req.params.id;
  const user = await User.findByIdAndUpdate(
    { _id: userId },
    {
      firstname: bodyData.firstname,
      lastname: bodyData.lastname,
      password: await bcrypt.hash(`${bodyData.password}`, 8),
      email: bodyData.email,
      addresses: bodyData.addresses,
    },
    { returnOriginal: false }
  );
  res.json(user);
}

// Remove the specified resource from storage.
async function destroy(req, res) {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);
  res.json({ message: "The User was deleted", userDeleted: user });
}

//// create token

async function createToken(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email }).populate({
      path: "orders",
      populate: "status",
    });
    const matchPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (user) {
      const token = jwt.sign({ userId: user.id }, process.env.SESSION_SECRET);
      res.json({
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          addresses: user.addresses,
          orders: user.orders,
          token: token,
        },
      });
    } else res.json("No existe este usuario");
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "User login failed",
      error: err.message,
    });
  }
}

async function searchUser(req, res) {
  const userName = slugify(req.body.searchValue).toLowerCase();
  const users = await User.find();
  const searchUser = users.filter(
    (user) =>
      slugify(user.firstname).toLowerCase().includes(userName) === true ||
      slugify(user.lastname).toLowerCase().includes(userName) === true
  );

  res.json(searchUser);
}

module.exports = {
  index,
  show,
  create,
  edit,
  destroy,
  createToken,
  searchUser,
};
