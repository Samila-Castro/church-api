import express from "express";
import process  from "os";

const app = express();
app.use(express.json());

const events =[];

function isValidUTCDate(dateString){
  const regexDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

  if(!regexDate.test(dateString)){
  return false;
  }

  return true;
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
      console.error("Error sending health check:", error);
      res.status(500).send({
        message: "Erro ao processar a verificação de saúde. Tente novamete mais tarde."
      });
  }
});

app.post("/events", (req, res)=> {
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
app.get("/events", (req, res) => {
  let filtered = events;

  if(req.query.name){
    filtered = events.filter( (event) => event.name === req.query.name);
  }

  if(req.query.date){
    if(isValidUTCDate(req.query.date)){
      filtered = filtered.filter((event) => event.date === req.query.date);
    }

    return res.status(400).send({
      messge: "A data aplicada ao filtro deve ser no formato UTC"
    })

  }

  filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  return res.status(200).send(filtered);
});


app.listen(3000, () => console.log("Server running on port 3000"));