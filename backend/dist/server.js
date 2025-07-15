"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const socket_1 = __importDefault(require("./services/socket"));
const httpServer = (0, http_1.createServer)(app_1.default);
const socketService = new socket_1.default();
socketService.io.attach(httpServer);
// Make the Socket.IO instance accessible to your Express app
// This is the key change to pass 'io' to your routes
app_1.default.set('io', socketService.io); // Cast app to any to set custom property
const PORT = process.env.PORT || 3000;
socketService.initListeners(); // You might adjust these listeners later
httpServer.listen(PORT, () => {
    console.log(` Server running on port http://localhost:${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV}`);
});
