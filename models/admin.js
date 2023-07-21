const Mongoose = require("mongoose");
const AdminSchema = Mongoose.Schema({
    aemail:"String",
    apassword:"String"}
)
const AdminModel = Mongoose.model("Admin",AdminSchema);
module.exports = AdminModel;