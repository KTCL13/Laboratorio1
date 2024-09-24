const express = require('express');
const axios = require('axios');
const dns = require('dns');

const app = express();

const containerPort= process.env.CONTAINER_PORT;
const hostPort= process.env.HOST_PORT;
const ipAddress = process.env.IP_ADDRESS

app.use(express.json());

app.get("/tokens", (req, res) => {
    res.status(200).end();
  });


const startServer = async () => {
    try {
        console.log('IP del host:', ipAddress);
        console.log(`Servidor corriendo en el puerto: ${containerPort}`);
        const requestOptions ={
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ipAddress: ipAddress , port: hostPort}),
          }; 
          await fetch(`http:${process.env.DIS_SERVERIP_PORT}/discoveryServer`, requestOptions).then((response) => {
            console.log(response.status);
          });
    } catch (error) {
        console.error('Error al obtener la IP:', error);
    }

};

app.listen(containerPort, startServer);




