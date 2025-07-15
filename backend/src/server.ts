
import { createServer } from 'http';
import app from './app';

// Socket.io
import SocketService from "./services/socket"



const httpServer=createServer(app);
const socketService=new SocketService();
socketService.io.attach(httpServer);


const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(` Server running on port http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV}`);
});

socketService.initListeners();