require("dotenv").config();
async function runAllSeeders() {
  const { mongoose } = require("../db");
  await mongoose.connection.dropDatabase();

  await require("./adminSeeder")();
  await require("./userSeeder")();
  await require("./productSeeder")();
  await require("./orderSeeder")();
  await require("./statusSeeder")();
  await require("./categorySeeder")();

  console.log("[Database] ¡Los datos de prueba fueron insertados!");
  process.exit();
}

runAllSeeders();
