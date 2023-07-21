const Mongoose = require("mongoose");
const TrackerSchema = Mongoose.Schema({
    hours: Number,
  minutes: Number,
  seconds: Number,
  addeddate: {type:Date,
  default:Date.now},
  userid:String,
  projectname:String,
  taskname:String,
  mode:String,
  jobdesc:String
  
    })
    const TrackerModel = Mongoose.model("Tracker",TrackerSchema);
    module.exports = TrackerModel;