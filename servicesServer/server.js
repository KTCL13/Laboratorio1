const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const containerPort = process.env.CONTAINER_PORT || 3000;

app.use(express.json());


app.use(express.static('frontend'));


app.post("/tokens", (req, res) => {
  const text = req.body.text;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  // Ejecutar el script de Python para contar los tokens
  const pythonProcess = exec(`python count_tokens.py`, (error, stdout, stderr) => {
    if (error) {
      console.error("Error ejecutando el script de Python:", error);
      return res.status(500).json({ error: "Error al contar tokens" });
    }
  
    if (stderr) {
      console.error("Error en el script de Python:", stderr);
      return res.status(500).json({ error: "Error al contar tokens" });
    }
  
    try {
      const result = JSON.parse(stdout);
      res.status(200).json(result);
    } catch (parseError) {
      console.error("Error parsing JSON from Python script:", parseError);
      res.status(500).json({ error: "Error al contar tokens" });
    }
  });

  pythonProcess.stdin.write(JSON.stringify({ text }));
  pythonProcess.stdin.end();
});

// Servidor en el puerto especificado
app.listen(containerPort, () => {
  console.log(`Server is running on port ${containerPort}`);
});
