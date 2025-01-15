const express = require('express');
const logger = require('./src/config/logger');
const cors = require("cors");
const router = require('./src/routes/routes');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
}));

app.use('/api/notification', router);


// Inicia el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
    logger.info(`Servidor corriendo en el puerto ${PORT}`);
});