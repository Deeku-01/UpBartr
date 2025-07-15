"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
class SocketService {
    constructor() {
        console.log("Init Socket server");
        this._io = new socket_io_1.Server({
            cors: {
                allowedHeaders: '*',
                origin: '*'
            }
        });
    }
    get io() {
        return this._io;
    }
    initListeners() {
        console.log('Init Socket Listeners...');
        const io = this.io;
        io.on("connect", (socket) => {
            console.log('New Socket Connected', socket.id);
            socket.on('event:message', async ({ message }) => {
                console.log("new Message Recieved");
            });
        });
    }
}
exports.default = SocketService;
