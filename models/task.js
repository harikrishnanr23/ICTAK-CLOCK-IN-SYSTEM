const Mongoose = require("mongoose");
const TaskSchema = Mongoose.Schema({
    taskname:String
    })
    const TaskModel = Mongoose.model("Tasks",TaskSchema);
    module.exports = TaskModel;