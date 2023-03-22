const { Product } = require("../models");

// Display a listing of the resource.
async function index(req, res) {
  const products = await Product.find();
  res.json(products);
}

// Display the specified resource.
async function show(req, res) {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  res.json(product);
}

// Show the form for creating a new resource
async function create(req, res) {
  function createSlug(model) {
    const slug = model.split(" ").join("-").toLowerCase();

    return slug;
  }
  console.log(createSlug);
  const newProduct = await Product.create({
    brand: req.body.brand,
    model: req.body.model,
    slug: createSlug(req.body.model),
    image: [req.body.image],
    highlight: req.body.highlight,
    price: req.body.price,
    stock: req.body.stock,
  });
  res.json(newProduct);
}

// Store a newly created resource in storage.
async function store(req, res) {}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.
async function update(req, res) {}

// Remove the specified resource from storage.
async function destroy(req, res) {
  const productId = req.params.id;
  const product = await Product.findByIdAndDelete(productId);
  res.json({ message: "The Product was deleted", productDeleted: product });
}

module.exports = {
  index,
  show,
  create,
  store,
  edit,
  update,
  destroy,
};
