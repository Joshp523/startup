import { MessageDialog } from './login/messageDialog';

class Notifier {

    constructor() {
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
                const userName = JSON.parse(await msg.name);
                this.receiveEvent(userName);
            } catch { }
        };
    }
    broadcastEvent(transaction) {
        this.socket.send(JSON.stringify(transaction));
    }
    receiveEvent(userName) {
        console.log(userName, "achieved a goal!");
        const container = document.createElement('div');
        document.body.appendChild(container);
        const root = ReactDOM.createRoot(container);
        root.render(<MessageDialog message={`${userName} achieved a goal!`} />);
        
    }
}
const Notifier = new Notifier();
export { Transaction, Notifier };
