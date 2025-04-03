const { Server } = require('ws');

function peerProxy(httpServer) {
    const wss = new Server({ server: httpServer, path: '/ws' });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        ws.on('message', (message) => {
            const messageString = message.toString(); // Convert Buffer to 
            console.log('Received:', messageString);

            // Broadcast the message to all connected clients
            wss.clients.forEach((client) => {
                if (client.readyState === ws.OPEN) {
                    client.send(messageString);
                }
            });
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
}

module.exports = { peerProxy };