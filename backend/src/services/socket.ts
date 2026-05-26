import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export function initSocketServer(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: '*', // In development, allow all origins
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join room for specific assignment
    socket.on('join', (data: { assignmentId: string }) => {
      if (data && data.assignmentId) {
        console.log(`👥 Client ${socket.id} joined room: ${data.assignmentId}`);
        socket.join(data.assignmentId);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getSocketServer(): Server | null {
  return io;
}
