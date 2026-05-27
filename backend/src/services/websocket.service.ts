import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { URL } from 'url';

interface ExtWebSocket extends WebSocket {
  assignmentId?: string;
  isAlive: boolean;
}

class WebSocketService {
  private wss: WebSocketServer | null = null;

  public init(server: any) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: ExtWebSocket, req: IncomingMessage) => {
      ws.isAlive = true;
      ws.on('pong', () => { ws.isAlive = true; });

      // Auto-subscribe if assignmentId in query
      if (req.url) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const assignmentId = url.searchParams.get('assignmentId');
        if (assignmentId) {
          ws.assignmentId = assignmentId;
        }
      }

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          if (data.event === 'subscribe' && data.payload?.assignmentId) {
            ws.assignmentId = data.payload.assignmentId;
          } else if (data.event === 'unsubscribe') {
            ws.assignmentId = undefined;
          } else if (data.event === 'ping') {
            ws.send(JSON.stringify({ event: 'pong', payload: {} }));
          }
        } catch (err) {
          console.error('WS message error', err);
        }
      });
    });

    // Heartbeat
    setInterval(() => {
      if (!this.wss) return;
      this.wss.clients.forEach((ws: WebSocket) => {
        const extWs = ws as ExtWebSocket;
        if (!extWs.isAlive) return extWs.terminate();
        extWs.isAlive = false;
        extWs.ping();
      });
    }, 30000);
  }

  public emitToAssignment(assignmentId: string, event: string, payload: any) {
    if (!this.wss) return;
    const message = JSON.stringify({ event, payload });
    this.wss.clients.forEach((ws: WebSocket) => {
      const extWs = ws as ExtWebSocket;
      if (extWs.readyState === WebSocket.OPEN && extWs.assignmentId === assignmentId) {
        extWs.send(message);
      }
    });
  }

  public emitGlobal(event: string, payload: any) {
    if (!this.wss) return;
    const message = JSON.stringify({ event, payload });
    this.wss.clients.forEach((ws: WebSocket) => {
      const extWs = ws as ExtWebSocket;
      if (extWs.readyState === WebSocket.OPEN) {
        extWs.send(message);
      }
    });
  }
}

export const wsService = new WebSocketService();
