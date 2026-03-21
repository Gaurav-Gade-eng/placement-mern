const express = require("express");
const router = express.Router();

const {
getCompanies,
getCompanyById,
createCompany,
deleteCompany
} = require("../controllers/companyController");

const protect = require("../middleware/authMiddleware");

const { getSuggestions } = require("../controllers/companyController");

router.get("/suggestions", protect, getSuggestions);





/* STUDENT ROUTES */

router.get("/",protect,getCompanies);


router.get("/:id",protect,getCompanyById);



/* TPO ROUTES */

router.post("/create",protect,createCompany);

router.delete("/:id",protect,deleteCompany);


module.exports = router;