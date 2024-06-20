require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { WebSocketServer } = require('ws');
const http = require('http');
const path = require('path');
const MemoryStore = require('memorystore')(session);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const initialOptions = [
    "Select 1 to Place an order.",
    "Select 99 to checkout order.",
    "Select 98 to see order history.",
    "Select 97 to see current order.",
    "Select 0 to cancel orde.r"
];

const items = [
   "1. Jollof Rice- 2000",
    "2. Fried Rice - 2000",
    "3. Coconut Rice - 2000",
    "4. Salad - 700",
    "5. Spaghetti - 1500",
    "6. Beef - 1000",
    "7. Chicken - 1500"
];

app.use(session({
    store: new MemoryStore({ checkPeriod: 3600000 }),
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } 
}));


let userSessions = {};

wss.on('connection', (ws) => {
    const userId = Math.random().toString(36).substring(7);
    userSessions[userId] = { currentOrder: [], orderHistory: [] };

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const session = userSessions[userId];

        if (data.type === 'init') {
            if (data.currentOrder.length > 0) {
                session.currentOrder = data.currentOrder;
            }
            if (data.orderHistory.length > 0) {
                session.orderHistory = data.orderHistory;
            }
            ws.send(JSON.stringify({
                message: "Welcome to the Mimi's Kitchen!\n We are here to cater to all your stomach needs.\n How can I assist you today?\n" + initialOptions.join('\n'),
                currentOrder: session.currentOrder,
                orderHistory: session.orderHistory
            }));
        }

        if (data.type === 'userMessage') {
            const userMessage = data.message.trim();

            switch (userMessage) {
                case '1':
                    ws.send(JSON.stringify({ message: 'Here are our items:\n' + items.join('\n') }));
                    break;
                case '99':
                    if (session.currentOrder.length > 0) {
                        session.orderHistory.push(...session.currentOrder);
                        session.currentOrder = [];
                        ws.send(JSON.stringify({
                            message: 'Order placed. You can place a new order or view your order history.',
                            currentOrder: session.currentOrder,
                            orderHistory: session.orderHistory
                        }));
                    } else {
                        ws.send(JSON.stringify({ message: 'No order to place.' }));
                    }
                    break;
                case '98':
                    if (session.orderHistory.length > 0) {
                        ws.send(JSON.stringify({
                            message: 'Order history:\n' + session.orderHistory.join('\n')
                        }));
                    } else {
                        ws.send(JSON.stringify({ message: 'No order history.' }));
                    }
                    break;
                case '97':
                    if (session.currentOrder.length > 0) {
                        ws.send(JSON.stringify({
                            message: 'Current order:\n' + session.currentOrder.join('\n')
                        }));
                    } else {
                        ws.send(JSON.stringify({ message: 'No current order.' }));
                    }
                    break;
                case '0':
                    if (session.currentOrder.length > 0) {
                        session.currentOrder = [];
                        ws.send(JSON.stringify({
                            message: 'Current order cancelled.',
                            currentOrder: session.currentOrder
                        }));
                    } else {
                        ws.send(JSON.stringify({ message: 'No current order to cancel.' }));
                    }
                    break;
                default:
                    const itemNumber = parseInt(userMessage, 10);
                    if (itemNumber > 0 && itemNumber <= items.length) {
                        session.currentOrder.push(items[itemNumber - 1]);
                        ws.send(JSON.stringify({
                            message: `Added ${items[itemNumber - 1]} to your order.`,
                            currentOrder: session.currentOrder
                        }));
                    } else {
                        ws.send(JSON.stringify({ message: 'Invalid option. Please select a valid option.' }));
                    }
                    break;
            }
        }
    });

    ws.on('close', () => {
        delete userSessions[userId];
    });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
