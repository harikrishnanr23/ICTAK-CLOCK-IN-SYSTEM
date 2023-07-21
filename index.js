const Express = require("express")
const Mongoose =require("mongoose")
const BodyParser = require("body-parser")
const Cors = require("cors")
const bcrypt= require('bcrypt')
const jwt =require("jsonwebtoken")
const EmpModel = require("./models/employee")
const ProjectModel = require("./models/project")
const TaskModel = require("./models/task")
const router = Express.Router();
const Tracker = require('./models/tracker');
const path = require("path")
const TrackerModel = require("./models/tracker")
const AdminModel = require("./models/admin")

const dotenv=require('dotenv').config()
const app= new Express()

app.use(Express.static(path.join(__dirname, "./build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});


app.use(BodyParser.json())
app.use(BodyParser.urlencoded({extended:true}))
app.use(Cors())
Mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})

app.post("/addempapi", async (req, res) => {
    console.log(req.body);

    try {
        // Generate salt
        const salt = bcrypt.genSaltSync(10);

        const newEmp = new EmpModel({
            ename: req.body.ename,
            erole: req.body.erole,
            eemail: req.body.eemail,
            ephnnum: req.body.ephnnum,
            epassword: bcrypt.hashSync(req.body.epassword, salt)
        });

        const savedEmp = await newEmp.save();
        res.json({ "Status": "Success", "Data": savedEmp });
    } catch (error) {
        res.json({ "Status": "Error", "Error": error.message });
    }
});
app.post("/addadmapi", async (req, res) => {
    console.log(req.body);

    try {
        const saltRounds = 10; // Define the number of salt rounds
        const hashedPassword = await bcrypt.hash(req.body.apassword, saltRounds);
        
        const newAdm = new AdminModel({
            aemail: req.body.aemail,
            apassword: hashedPassword
        });

        const savedAdm = await newAdm.save();
        res.json({"Status": "Success", "Data": savedAdm });
    } catch (error) {
        console.error(error); // Log the error to the console
        res.json({"Status": "Error", "Error": error });
    }
});
app.post("/addprojectapi",async(req,res)=>{
    console.log(req.body)
    const newProject = new ProjectModel({projectname :req.body.projectname})
    await newProject.save(
        (error,data)=>{
            if(error){
                res.json({"Status":"Error","Error":error})
            }
            else{
                res.json({"Status":"Success","Data":data})
            }
        }
    )
})
app.post("/addtaskapi",async(req,res)=>{
    console.log(req.body)
    const newTask = new TaskModel({taskname :req.body.taskname})
    await newTask.save(
        (error,data)=>{
            if(error){
                res.json({"Status":"Error","Error":error})
            }
            else{
                res.json({"Status":"Success","Data":data})
            }
        }
    )
})
app.post("/adminviewempapi",async(req,res)=>{
    try{
        var result=await EmpModel.find();
        res.send(result);

    }catch(error){
        res.status(500).send(error);
    }
})

app.post("/loginapi",async(req,res)=>{
    var getEemail = req.body.eemail
    var epassword = req.body.epassword
    let result = EmpModel.find({eemail:getEemail}, (err,data)=>{
        if (data.length>0){
            const passwordValidator = bcrypt.compareSync(epassword,data[0].epassword)
            if (passwordValidator){
                // res.send({"status":"success","data":data})
                jwt.sign({eemail: getEemail ,id:data[0]._id},"ictacademy",{expiresIn:"1d"},
                (err,token)=>{
                    if(err){
                        res.json({"status":"error","error":err})
                    }else{
                        res.json({"status":"success","data":data,"token":token})
                    }
                })

            }else{
                res.send({"status":"failed","data":"invalid email"})
            }

        }else{
            res.send({"status":"failed","data":"invalid email"})
        }
})
})

app.post("/admloginapi",async(req,res)=>{
    var getAemail = req.body.aemail
    var apassword = req.body.apassword
    let result = AdminModel.find({eemail:getAemail}, (err,data)=>{
        if (data.length>0){
            const passwordValidator = bcrypt.compareSync(apassword,data[0].apassword)
            if (passwordValidator){
                // res.send({"status":"success","data":data})
                jwt.sign({aemail: getAemail ,id:data[0]._id},"ictacademy",{expiresIn:"1d"},
                (err,token)=>{
                    if(err){
                        res.json({"status":"error","error":err})
                    }else{
                        res.json({"status":"success","data":data,"token":token})
                    }
                })

            }else{
                res.send({"status":"failed","data":"invalid email"})
            }

        }else{
            res.send({"status":"failed","data":"invalid email"})
        }
})
})



//timetracker
app.post("/trackerapi",async(req,res)=>{
    
    jwt.verify(req.body.token,"ictacademy",(err,decoded)=>{
        if(decoded && decoded.eemail){


            let newTracker = new TrackerModel({
                
                hours: req.body.hours,
                minutes: req.body.minutes,
                seconds: req.body.seconds,
                userid:req.body.userid,
                projectname:req.body.projectname,
                taskname:req.body.taskname,
                mode:req.body.mode,
                jobdesc:req.body.jobdesc})
                newTracker.save()
                res.json({"status":"Tracker added successfully"})
        }else{
            res.json({"status":"unauthorized user"})
        }
    })
    
    
})



// app.get('/time-tracking', async (req, res) => {
//     const employeeId = req.params.id;
//     try {
//       const timeTrackingRecords = await TimeTracking.find({ employeeId });
//       res.json(timeTrackingRecords);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

app.post("/allprojectsapi",async(req,res)=>{
    try{
        var result= await ProjectModel.find();
        res.send(result);
    }catch(error){
        res.status(500).send(error);
    
    }
})

app.post("/alltasksapi", async(req,res)=>{
    try{
        var result = await TaskModel.find();
        res.send(result);
    }catch(error){
        res.status(500).send(error)
    }
})

app.post("/viewalltrackersapi",async(req,res)=>{
    try{
        var result= await TrackerModel.find({"userid":req.body.userid});
        res.send(result)
        
    }catch(error){
        res.status(500).send(error)
    }
})

app.post("/profileapi",async(req,res)=>{
    try {
        var result= await EmpModel.findOne({"_id":req.body._id});
        res.send(result);
    } catch(error){
        res.status(500).send(error);
    }
})
app.post("/updateapi", async(req, res) => {
        // use req.params.id to fetch employee data from a database
        // send the employee data as a JSON response
    try {
        var result= await EmpModel.findOne({"_id":req.body._id});
        res.send(result);
    } catch(error){
        res.status(500).send(error);
        }
      })

      app.post("/makeupdateapi", async (req, res) => {
        console.log(req.body);
        try {
          const updatedEmp = await EmpModel.updateOne(
            { _id: req.body._id },
            { $set: { ename: req.body.ename, erole: req.body.erole, eemail: req.body.eemail,ephnnum:req.body.ephnnum } }
          );
          console.log(updatedEmp);
          res.json({ Status: "Success", Data: updatedEmp });
        } catch (error) {
          console.log(error);
          res.json({ Status: "Error", Error: error });
        }
      });
  
// Delete employee by ID and their associated trackers
app.delete("/deleteapi/:id", async (req, res) => {
    const empId = req.params.id;
  
    try {
      // Delete employee by ID
      const result = await EmpModel.deleteOne({ _id: empId });
      if (result.deletedCount === 0) {
        res.json({ Status: "Error", Error: "Employee not found" });
        return;
      }
  
      // Delete associated trackers
      const trackerResult = await TrackerModel.deleteMany({ userid: empId });
      if (trackerResult.deletedCount === 0) {
        res.json({ Status: "Error", Error: "No associated trackers found" });
        return;
      }
  
      res.json({ Status: "Success" });
    } catch (error) {
      console.log(error);
      res.json({ Status: "Error", Error: error });
    }
  });
  
  // Delete trackers by user ID
  app.delete("/deletetrackersapi/:id", async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Delete trackers by user ID
      const result = await TrackerModel.deleteMany({ userid: userId });
      if (result.deletedCount === 0) {
        res.json({ Status: "Error", Error: "No associated trackers found" });
        return;
      }
  
      res.json({ Status: "Success" });
    } catch (error) {
      console.log(error);
      res.json({ Status: "Error", Error: error });
    }
  });
 
  app.put('/trackerapi/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const { hours, minutes, seconds, projectname, taskname, mode, jobdesc } = req.body;
      const updatedTracker = await Tracker.findByIdAndUpdate(id, {
        hours,
        minutes,
        seconds,
        projectname,
        taskname,
        mode,
        jobdesc,
      }, { new: true });
      res.json({
        status: "Tracker updated successfully",
        tracker: updatedTracker
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "Failed to update tracker",
        error: error.message
      });
    }
  });



const PORT=process.env.PORT||3011

app.listen(PORT,()=>{
    console.log("server Started")
})