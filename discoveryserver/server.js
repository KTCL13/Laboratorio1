const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

const instances = []


app.post("/discoveryServer", async(req, res) => {
    console.log("data:",req.body);
    const instance= req.body
    instances.push(instance);
    res.status(200).end();
    const requestOptions ={
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instances)
    }; 
    await fetch(`http:192.168.32.1:5000/middleware`, requestOptions).then((response) => {
      console.log(response.status);
    });
  });

app.listen(port, () => {
    console.log(`Servidor corriendo en la puerto: ${port}`);
});