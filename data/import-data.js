const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("./../modal/recipeModal");

dotenv.config({ path: "./config.env" });

const DB = process.env.MONGODB_URI.replace("<password>", process.env.PASSWORD);
mongoose.connect(DB).then(() => {
  console.log("Connection to DB successfull");
});

const recipies = JSON.parse(
  fs.readFileSync(`${__dirname}/recipies.json`, "utf-8")
);

const importData = async () => {
  try {
    await Recipe.create(recipies);
    console.log("Data successfully loaded");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Recipe.deleteMany();
    console.log("Data successfully deleted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] == "--import") {
  importData();
} else if (process.argv[2] == "--delete") {
  deleteData();
}
