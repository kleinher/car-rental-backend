const express = require('express');
const logger = require('./src/config/logger');
const cors = require("cors");
const router = require('./src/routes/routes');
const carRouter = require('./src/routes/carRoutes');
require('dotenv').config();

const http = require('http');
const { setWebSocketServer, initializeWebsocket } = require('./src/websocket/WebSocketServer');
const { initializeWppClient } = require('./src/client/WhatsappClient');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
}));

// Rutas
app.use('/api/notification', router);
app.use('/api/car', carRouter); // Se puede cambiar



// Crear el servidor HTTP
const server = http.createServer(app);

// Inicializar WebSocketServer
const webSocketServer = setWebSocketServer(server);
initializeWebsocket();
initializeWppClient();
// Iniciar el servidor HTTP
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger.info(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = webSocketServer;
