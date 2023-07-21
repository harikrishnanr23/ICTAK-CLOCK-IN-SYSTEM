const Mongoose = require("mongoose");
const ProjectSchema = Mongoose.Schema({
    projectname:String
    })
    const ProjectModel = Mongoose.model("Projects",ProjectSchema);
    module.exports = ProjectModel;