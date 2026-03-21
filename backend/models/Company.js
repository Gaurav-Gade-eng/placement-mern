const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({

companyName:{
type:String,
required:true
},

salary:{
type:Number,
required:true
},

offers:{
type:Number,
default:0
},

minimumCGPA:{
type:Number,
required:true
},

requiredSkills:[
{
type:String
}
],

logo:{
type:String,
default:""
},

createdAt:{
type:Date,
default:Date.now
}
,requiredSkills: [String],
minCGPA: Number

});

module.exports = mongoose.model("Company",companySchema);