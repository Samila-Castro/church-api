import express from "express";
import process  from "os";

const app = express();
app.use(express.json());

const events =[];

function isValidUTCDate(dateString){
  const date = new Date(dateString);
   if(date.toISOString() === dateString){
    return true;
   }

  return false;
}

app.get("/health-check", (req,res)=> {
  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };

  try{
    res.send(healthCheck);
  } catch(error){
    healthCheck.message= error
    res.status(500).send()
  }
});

app.post("/events", (req, res)=>{
  const { name, date, location, description} = req.body;

  if((!name || !date || location === "")){
    return res.status(400).send({text: "Os campos name, date e location são obrigatórios"});
  }
 
  if(isValidUTCDate(date)){
    const newEvent = {
      name: name,
      date: date,
      location: location,
      description: description
    };

    events.push(newEvent);
    return res.status(200).send(newEvent);
  }

  return res.status(400).send({text: "O formato precisa ser UTC"});
  
});


app.listen(3000, () => console.log("Server running on port 3000"));