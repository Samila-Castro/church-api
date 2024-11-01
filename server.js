import express from "express";
import process  from "os";

const app = express();

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

app.listen(3000, () => console.log("Server running on port 3000"));