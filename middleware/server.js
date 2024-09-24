const express = require('express');

const app = express();
const port = 5000;

app.use(express.json());

let instances = []

app.post("/middleware", (req, res) => {
    console.log(req.body);
    instances = req.body
    res.status(200).end();
    console.log(instances[0])
  });


app.listen(port, () => {
    console.log(`Servidor corriendo en la puerto: ${port}`);
});