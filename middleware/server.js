const express = require('express');
const axios = require('axios');

const app = express();
const port = 5000;

app.use(express.json());

let instances = [];
let connections = [];

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

  let leastConnectedServer = connections.reduce((prev, curr) => 
    prev.requests < curr.requests ? prev : curr
  );

  for (let i = 0; i < connections.length; i++) {
    try {
      console.log(`Llamando a servidor: ${leastConnectedServer.instance.url}`);

      const response = await axios.post(leastConnectedServer.instance.url, req.body);
      leastConnectedServer.requests++;
      success = true; 
      return res.json(response.data);

    } catch (error) {
      console.log(`Error. ${leastConnectedServer.instance.url}: ${error.message}. ${new Date()}`);
      errorMessages.push(`Error. ${leastConnectedServer.instance.url}: ${error.message}. ${new Date()}`);
      serverTried++;

      connections = connections.filter(conn => conn.instance.url !== leastConnectedServer.instance.url);

      if (connections.length > 0) {
        leastConnectedServer = connections.reduce((prev, curr) => 
          prev.requests < curr.requests ? prev : curr
        );
      } else {
        break; 
      }
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


setInterval(() => {
  connections.forEach(server => server.requests = 0);
  console.log("Reiniciando contador de peticiones...");
}, 60000);

app.listen(port, () => {
  console.log(`Middleware corriendo en el puerto: ${port}`);
});