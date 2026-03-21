const Company = require("../models/Company");
const User = require("../models/User");

exports.getRecommendedCompanies = async (req,res)=>{

 try{

 const user = await User.findById(req.user.id);

 if(!user){
 return res.status(404).json({message:"User not found"});
 }

 const companies = await Company.find();

 const recommended = companies.filter(company => {

 const cgpaEligible = user.cgpa >= company.minimumCGPA;

 const skillMatch = company.requiredSkills.some(skill =>
 user.skills.includes(skill)
 );

 return cgpaEligible && skillMatch;

 });

 res.json(recommended);

 }catch(error){

 res.status(500).json({message:"Server Error"});

 }

};