const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Company = require("../models/Company");
const companies = require("../data/companies.json");

dotenv.config();

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const importCompanies = async () => {

  try {

    // remove old companies
    await Company.deleteMany();

    // insert new companies
    await Company.insertMany(companies);

    console.log("Companies Imported Successfully");
    console.log("Total companies:", companies.length);

    process.exit();

  } catch (error) {

    console.log(error);

  }

};

importCompanies();