const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

let instances = [];

app.post("/discoveryServer", async (req, res) => {
    console.log("Datos recibidos:", req.body);
    const instance = req.body;
    instances.push(instance);
    res.status(200).end();

    try {
        await axios.post("localhost:5000/middleware", instances);
        console.log("Instancias enviadas al middleware");
    } catch (error) {
        console.error("Error al enviar instancias al middleware:", error);
    }
});

app.listen(port, () => {
    console.log(`Discovery Server corriendo en el puerto: ${port}`);
});
