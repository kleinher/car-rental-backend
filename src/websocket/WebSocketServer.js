const WebSocket = require('ws');
const { getAllCars } = require('../client/CarsClient');

wss = null;

function setWebSocketServer(server) {
    wss = new WebSocket.Server({ server });
}

function initializeWebsocket() {
    wss.on('connection', (ws) => {
        console.log('Cliente conectado al WebSocket.');

        // Enviar datos iniciales al cliente
        ws.send(JSON.stringify(getAllCars()));

        ws.on('close', () => {
            console.log('Cliente desconectado del WebSocket.');
        });

        ws.on('error', (error) => {
            console.error('Error en WebSocket:', error);
        });
    });
}

function broadcast() {
    const data = JSON.stringify(getAllCars());
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}


module.exports = { broadcast, initializeWebsocket, setWebSocketServer };
