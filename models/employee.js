const Mongoose = require("mongoose");
const EmpSchema = Mongoose.Schema({
    ename: String,
      
    erole : String,
      
    eemail: String,
    ephnnum:String,
      
    epassword: String}
)
const EmpModel = Mongoose.model("Employees",EmpSchema);
module.exports = EmpModel;