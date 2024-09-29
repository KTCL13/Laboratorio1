const express = require('express');
const axios = require('axios');

const app = express();
const port = 5000;

app.use(express.json());

let instances = [];
let connections = [];
const logs = [];

app.post("/middleware", (req, res) => {
  instances = req.body;
  connections = instances.map(instance => ({ instance, requests: 0 }));
  res.status(200).end();
  console.log("Instancias actualizadas: ", connections);
});

app.post("/request", async (req, res) => {
  if (connections.length === 0) {
    return res.status(503).json({ error: "No hay servidores disponibles" });
  }

  let success = false;
  let errorMessages = [];
  let serverTried = 0;

  for (let i = 0; i < connections.length; i++) {
    let currentServer = connections[i];

    try {
      const response = await axios.post(currentServer.instance.url, req.body);
      currentServer.requests++;
      success = true;
      logs.push(`${currentServer.instance.url} : ${response.requests.status}`);
      return res.json(response.data);
    } catch (error) {
      console.log(`Error con servidor: ${currentServer.instance.url}`);
      errorMessages.push(`Error con servidor ${currentServer.instance.url}: ${error.message}`);
      serverTried++;
      logs.push(`${currentServer.instance.url}: ${error.message}`);
    }
  }

  if (!success) {
    return res.status(500).json({
      error: "Todos los servidores fallaron",
      errorMessages: errorMessages,
      serversTried: serverTried
    });
  }
});


app.get("/status", (req,res) =>{
  
  res.json(logs);

});

setInterval(() => {
  connections.forEach(server => server.requests = 0);
  console.log("Reiniciando contador de peticiones...");
}, 60000);

app.listen(port, () => {
  console.log(`Middleware corriendo en el puerto: ${port}`);
});