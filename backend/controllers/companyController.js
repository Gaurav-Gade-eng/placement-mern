const Company = require("../models/Company");


/* GET ALL COMPANIES */

exports.getCompanies = async (req,res)=>{

try{

const companies = await Company.find().sort({salary:-1});

res.json(companies);

}catch(error){

res.status(500).json({message:"Server error"});

}

};



/* GET COMPANY BY ID */

exports.getCompanyById = async (req,res)=>{

try{

const company = await Company.findById(req.params.id);

if(!company){
return res.status(404).json({message:"Company not found"});
}

res.json(company);

}catch(error){

res.status(500).json({message:"Server error"});

}

};



/* CREATE COMPANY (TPO) */

exports.createCompany = async (req,res)=>{

try{

const {
companyName,
salary,
offers,
minimumCGPA,
requiredSkills,
logo
} = req.body;

const company = new Company({

companyName,
salary,
offers,
minimumCGPA,
requiredSkills,
logo

});

await company.save();

res.json({
message:"Company created",
company
});

}catch(error){

res.status(500).json({message:"Server error"});

}

};



/* DELETE COMPANY */

exports.deleteCompany = async (req,res)=>{

try{

await Company.findByIdAndDelete(req.params.id);

res.json({message:"Company deleted"});

}catch(error){

res.status(500).json({message:"Server error"});

}

};

exports.getSuggestions = async (req, res) => {
  try {

    const student = await User.findById(req.user._id);

    const companies = await Company.find();

    const suggestions = companies.filter(c => {

      // CGPA check
      const cgpaMatch = student.cgpa >= c.minCGPA;

      // Skill match
      const skillMatch = c.requiredSkills.some(skill =>
        student.skills.includes(skill)
      );

      return cgpaMatch && skillMatch;
    });

    res.json(suggestions);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};