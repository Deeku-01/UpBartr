"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
// Socket.io
const socket_1 = __importDefault(require("./services/socket"));
const httpServer = (0, http_1.createServer)(app_1.default);
const socketService = new socket_1.default();
socketService.io.attach(httpServer);
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(` Server running on port http://localhost:${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV}`);
});
socketService.initListeners();
