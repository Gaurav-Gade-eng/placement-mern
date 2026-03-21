const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({

student:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

announcement:{
type:mongoose.Schema.Types.ObjectId,
ref:"Announcement"
},

status:{
type:String,
enum:["pending","accepted","rejected"],
default:"pending"
},

appliedAt:{
type:Date,
default:Date.now
}

});

/* 🔥 UNIQUE COMBINATION */
applicationSchema.index(
{ student:1, announcement:1 },
{ unique:true }
);

module.exports = mongoose.model("Application",applicationSchema);