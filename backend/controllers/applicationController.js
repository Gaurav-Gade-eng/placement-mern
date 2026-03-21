const Application = require("../models/Application");
const { sendApplicationEmail } = require("../utils/sendEmail");


/* APPLY */

exports.applyDrive = async(req,res)=>{

try{

const {announcementId} = req.body;

const existing = await Application.findOne({
student:req.user._id,
announcement:announcementId
});

if(existing){
return res.status(400).json({message:"Already applied"});
}

const application = await Application.create({
student:req.user._id,
announcement:announcementId
});

res.json(application);

}catch(err){
res.status(500).json({message:err.message});
}

};


/* GET APPLICATIONS */

exports.getApplications = async(req,res)=>{

const apps = await Application
.find()
.populate("student","name email department semester")
.populate("announcement","title company");

res.json(apps);

};


/* UPDATE STATUS */

exports.updateStatus = async(req,res)=>{

try{

const {status, reason} = req.body;

const app = await Application
.findById(req.params.id)
.populate("student","email name")
.populate("announcement","title company");

if(!app){
return res.status(404).json({message:"Application not found"});
}

app.status = status;

await app.save();

/* ✅ SEND EMAIL */

await sendApplicationEmail({
  studentName: app.student.name,
  email: app.student.email,
  company: app.announcement.company,
  drive: app.announcement.title,
  status,
  reason
});

res.json(app);

}catch(err){
console.log("ERROR:", err);   // 🔥 important
res.status(500).json({message:err.message});
}

};