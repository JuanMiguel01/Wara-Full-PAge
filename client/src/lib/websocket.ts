// WebSocket client based on blueprint:javascript_websocket
import { auth } from "./firebase";

class WebSocketClient {
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: any) => void)[] = [];
  private reconnectTimeout: NodeJS.Timeout | null = null;

  connect(userId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?userId=${userId}`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(data));
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Auto-reconnect after 3 seconds
      this.reconnectTimeout = setTimeout(() => {
        console.log('Attempting to reconnect...');
        this.connect(userId);
      }, 3000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendMessage(matchId: string, content: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'chat_message',
        matchId,
        content,
      }));
    } else {
      console.error('WebSocket not connected');
    }
  }

  onMessage(handler: (message: any) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }
}

export const wsClient = new WebSocketClient();
