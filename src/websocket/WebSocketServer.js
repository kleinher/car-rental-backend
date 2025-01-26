const WebSocket = require('ws');
const { getAllCars } = require('../client/CarsClient');
wss = null;
let isClientReady = false;

function setWebSocketServer(server) {
    wss = new WebSocket.Server({ server });
}

function initializeWebsocket() {
    wss.on('connection', (ws) => {
        console.log('Cliente conectado al WebSocket.');

        // Enviar datos iniciales al cliente
        ws.send(JSON.stringify({ type: 'cars', cars: getAllCars() }));
        if (isClientReady) {
            ws.send(JSON.stringify({ type: 'validated', value: true }));
        }

        ws.on('close', () => {
            console.log('Cliente desconectado del WebSocket.');
        });

        ws.on('error', (error) => {
            console.error('Error en WebSocket:', error);
        });
    });
}

function broadcast(cars) {

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'cars', cars: cars }));
        }
    });
}

function sendQr(qrCode) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'qr', qr: qrCode }));
        }
    });
}

function sendOk() {
    isClientReady = true;

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'validated', value: true }));
        }
    });
}

function setClientNotReady() {
    isClientReady = false;
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'validated', value: false }));
        }
    });
}





module.exports = { broadcast, initializeWebsocket, setWebSocketServer, sendQr, sendOk, setClientNotReady };
