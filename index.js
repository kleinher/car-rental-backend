const express = require('express');
const whatsappClient = require('./src/client/whatsapp');
const logger = require('./src/config/logger');
const notificationRoutes = require('./src/routes/notificationRoutes');
const cors = require("cors");


require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
}));
app.use('/api/notification', notificationRoutes);

whatsappClient.initialize();

// Inicia el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
    logger.info(`Servidor corriendo en el puerto ${PORT}`);
});