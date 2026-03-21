const Announcement = require("../models/Announcement");


/* CREATE */

exports.createAnnouncement = async(req,res)=>{

try{

const announcement = await Announcement.create(req.body);

res.json(announcement);

}catch(err){

res.status(500).json({message:err.message});

}

};


/* GET */

exports.getAnnouncements = async(req,res)=>{

const announcements = await Announcement.find().sort({createdAt:-1});

res.json(announcements);

};


/* DELETE */

exports.deleteAnnouncement = async(req,res)=>{

await Announcement.findByIdAndDelete(req.params.id);

res.json({message:"Deleted"});

};


/* UPDATE */

exports.updateAnnouncement = async(req,res)=>{

const updated = await Announcement.findByIdAndUpdate(

req.params.id,
req.body,
{new:true}

);

res.json(updated);

};