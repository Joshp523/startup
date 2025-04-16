import { MessageDialog } from './login/messageDialog';
import ReactDOM from 'react-dom/client';

class Notifier {
    static instance;

    constructor() {
        if (Notifier.instance) {
            return Notifier.instance; // Return the existing instance
        }

        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };
        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        this.socket.onmessage = async (msg) => {
            try {
                const { name: userName } = JSON.parse(msg.data);
                this.receiveEvent(userName);
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };

        Notifier.instance = this; // Save the instance
    }

    broadcastEvent(transaction) {
        console.log('Attempting to broadcast event:', transaction);
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(transaction));
            console.log('Event broadcasted successfully');
        } else {
            console.error('WebSocket is not open');
        }
    }

    receiveEvent(userName) {
        console.log(userName, "achieved a goal!");
        alert(`${userName} achieved a goal!`);
    }
}

export { Notifier };
