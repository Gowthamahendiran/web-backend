const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express();

const Port = 5002;
app.use(cors())
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/Registerpage', {
    useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB Connection Error"))
db.once("open", ()=> {
    console.log("MongoDB Connected");
})


const newLogin = new mongoose.Schema({
    Name: String,
    Email: String,
    Contact: String,
    Password: String,
    One: String,
    Two: String,
    Three: String,
    Four: String,
    Leave: Date,
    FromLeave: Date,
    ToLeave: Date,
    Subject: String,
    Reason: String,
})


const NewLogin = mongoose.model("Newlogin", newLogin)

app.post("/api/signup", async(req,res)=>{
    const {Name, Email, Contact, Password}= req.body;
    try{
        const user = new NewLogin({
            Name, Email, Contact, Password
        })
        await user.save();
        res.status(201).json({ message: "User Added" })
    }
    catch (error){
        res.status(500).json({ message: "Error Occured"})
    }
});

app.post("/api/login", async(req,res)=>{
    const { Email, Password} = req.body;
    try{

        const user = await NewLogin.findOne({ Email });
        if (!user || user.Password !== Password) {
            return res.status(401).json({ error: "Authentication failed" });
          }
        res.status(200).json(user);
    }
    catch(error){
        return res.status(500).json({error: "Internel Server Error"})
    }
});

app.post('/api/todo', async (req, res) => {
    const { One, Two, Three, Four, userEmail } = req.body; 
  
    try {
      const user = await NewLogin.findOne({ Email: userEmail });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.One = One;
      user.Two = Two;
      user.Three = Three;
      user.Four = Four;
  
      await user.save();
  
      res.status(201).json({ message: 'Todo Added' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



  app.post('/api/leave', async (req, res) => {
    const { Leave, userEmail, FromLeave, ToLeave, Subject, Reason } = req.body;

    try {
        const user = await NewLogin.findOne({ Email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.Leave = Leave;
        user.FromLeave= FromLeave;
        user.ToLeave= ToLeave;
        user.Subject= Subject;
        user.Reason= Reason;
        await user.save();

        res.status(201).json({ message: 'Leave Added' });
    } catch (error) {
        console.error('Error in /api/leave:', error); 
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




  app.get('/api/todo/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
  
    try {
      const user = await NewLogin.findOne({ Email: userEmail });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const todos = {
        One: user.One,
        Two: user.Two,
        Three: user.Three,
        Four: user.Four,
      };
  
      res.status(200).json({ todos });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
  });
  