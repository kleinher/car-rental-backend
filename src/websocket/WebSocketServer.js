const WebSocket = require('ws');
const CarRepository = require('../repositories/CarRepository');
const logger = require('../config/logger');
let isClientReady = false;
let qr = null;
let wss;

function setWebSocketServer(server) {
    wss = new WebSocket.Server({ server });
}

function initializeWebsocket() {
    wss.on('connection', async (ws) => {

        // Enviar datos iniciales al cliente
        const cars = await CarRepository.getAll();

        const datos = JSON.stringify({ type: 'cars', cars: cars })
        ws.send(datos);
        sendQr();
        if (isClientReady) {
            ws.send(JSON.stringify({ type: 'validated', value: true }));
        }

        ws.on('close', () => {
        });

        ws.on('error', (error) => {
            console.error('Error en WebSocket:', error);
        });
    });
}

async function broadcast() {
    const cars = await CarRepository.getAll()
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'cars', cars: cars }));
        }
    });

}

function setQr(qrCode) {
    qr = qrCode;
}

function sendQr() {
    logger.info("QR enviado")
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'qr', qr: qr }));
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





module.exports = { setQr, broadcast, initializeWebsocket, setWebSocketServer, sendQr, sendOk, setClientNotReady };
