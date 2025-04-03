import { MessageDialog } from './login/messageDialog';

const Transaction = {
    amount: Number(amount),
    type,
    category,
    notes,
    member: localStorage.getItem('name'),
    date: new Date().toISOString(),
    family: localStorage.getItem('familyId'),
};

class Notifier {
    events = [];
    handlers = [];

    constructor() {
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.socket.onopen = (event) => {
            this.receiveEvent(new EventMessage('Startup', Transaction.family, { msg: 'connected' }));
        };
        this.socket.onclose = (event) => {
            this.receiveEvent(new EventMessage('Startup', Transaction.family, { msg: 'disconnected' }));
        };
        this.socket.onmessage = async (msg) => {
            try {
                const event = JSON.parse(await msg.data.text());
                this.receiveEvent(event);
            } catch { }
        };
    }
    broadcastEvent(transaction) {
        this.socket.send(JSON.stringify(transaction));
    }
    receiveEvent(event) {
        MessageDialog({ message: event })
        
    }
}
const Notifier = new Notifier();
export { Transaction, Notifier };
