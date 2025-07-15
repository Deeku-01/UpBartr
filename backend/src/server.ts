// server.ts
import { createServer } from 'http';
import app from './app';
import SocketService from "./services/socket";

const httpServer = createServer(app);
const socketService = new SocketService();
socketService.io.attach(httpServer);

// Make the Socket.IO instance accessible to your Express app
// This is the key change to pass 'io' to your routes
(app as any).set('io', socketService.io); // Cast app to any to set custom property

const PORT = process.env.PORT || 3000;

socketService.initListeners(); // You might adjust these listeners later

httpServer.listen(PORT, () => {
  console.log(` Server running on port http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV}`);
});