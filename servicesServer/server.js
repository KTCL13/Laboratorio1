const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const dns = require('dns');

const app = express();
const containerPort = process.env.CONTAINER_PORT;
const hostPort = process.env.HOST_PORT;
const ipAddress = process.env.IP_ADDRESS;

app.use(express.json());

app.get("/tokens", (req, res) => {
    res.status(200).end();
});

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

const startServer = async () => {
    try {
        console.log('IP del host:', ipAddress);
        console.log(`Servidor corriendo en el puerto: ${containerPort}`);
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ipAddress: ipAddress, port: hostPort }),
        };
        await fetch(`http:${process.env.DIS_SERVERIP_PORT}/discoveryServer`, requestOptions).then((response) => {
            console.log(response.status);
        });
    } catch (error) {
        console.error('Error al obtener la IP:', error);
    }
};

app.listen(containerPort, startServer);
