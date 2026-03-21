const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({

title:{
type:String,
required:true
},

company:String,

description:String,

type:{
type:String,
enum:["general","drive"],
default:"general"
},

driveDate:Date,

/* TARGET STUDENTS */

semesters:[
Number
],

departments:[
String
],

allStudents:{
type:Boolean,
default:false
},

createdAt:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("Announcement",announcementSchema);