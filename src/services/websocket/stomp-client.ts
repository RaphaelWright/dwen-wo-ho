import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ConnectionStatus } from "@/lib/types/websocket";
import { API_BASE_URL } from "@/configs/config";

class StompWebSocketClient {
  private client: Client | null = null;
  private connectionStatus: ConnectionStatus = "DISCONNECTED";
  private reconnectAttempt = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private messageHandlers: Map<string, ((payload: unknown) => void)[]> =
    new Map();

  private readonly reconnectDelays = [1000, 2000, 4000, 8000, 16000, 30000];
  private statusChangeCallbacks: ((status: ConnectionStatus) => void)[] = [];
  private lastMessageTimestamp: number = 0;
  private reconnectCallbacks: (() => void)[] = [];

  // Get singleton instance
  private static instance: StompWebSocketClient;
  static getInstance(): StompWebSocketClient {
    if (!StompWebSocketClient.instance) {
      StompWebSocketClient.instance = new StompWebSocketClient();
    }
    return StompWebSocketClient.instance;
  }

  getStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusChangeCallbacks.push(callback);
    return () => {
      this.statusChangeCallbacks = this.statusChangeCallbacks.filter(
        (cb) => cb !== callback,
      );
    };
  }

  private setStatus(status: ConnectionStatus) {
    this.connectionStatus = status;
    this.statusChangeCallbacks.forEach((cb) => cb(status));
  }

  connect(token: string): void {
    if (this.client?.active) {
      console.log("[STOMP] Already connected");
      return;
    }

    this.setStatus("CONNECTING");

    // Use SockJS with the correct URL format
    // The backend expects: /ws/notifications?token=JWT
    const socketUrl = `${API_BASE_URL}/ws/notifications?token=${encodeURIComponent(token)}`;

    console.log("[STOMP] Connecting to:", socketUrl.replace(token, "***"));

    this.client = new Client({
      webSocketFactory: () => {
        const sockjs = new SockJS(socketUrl, undefined, {
          transports: ["websocket", "xhr-streaming", "xhr-polling"],
          timeout: 10000,
        });
        return sockjs;
      },
      reconnectDelay: 0, // We handle reconnection manually for more control
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: process.env.NODE_ENV === "development" ? console.log : () => {},

      onConnect: () => {
        console.log("[STOMP] Connected successfully");
        this.reconnectAttempt = 0;
        this.setStatus("CONNECTED");
        this.resubscribeAll();
      },

      onDisconnect: () => {
        console.log("[STOMP] Disconnected");
        this.setStatus("DISCONNECTED");
        this.scheduleReconnect(token);
      },

      onStompError: (frame) => {
        console.error("[STOMP] Broker error:", frame.headers["message"]);
        this.setStatus("ERROR");
      },

      onWebSocketError: (event) => {
        console.error("[STOMP] WebSocket error:", event);
        this.setStatus("ERROR");
        this.scheduleReconnect(token);
      },

      onWebSocketClose: (event) => {
        console.log("[STOMP] WebSocket closed:", event.code, event.reason);
        this.setStatus("DISCONNECTED");
        this.scheduleReconnect(token);
      },
    });

    this.client.activate();
  }

  private scheduleReconnect(token: string): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const delay =
      this.reconnectDelays[
        Math.min(this.reconnectAttempt, this.reconnectDelays.length - 1)
      ];

    console.log(
      `[STOMP] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempt + 1})`,
    );
    this.setStatus("CONNECTING");

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempt++;
      this.connect(token);
    }, delay);
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.reconnectAttempt = 0;
    this.setStatus("DISCONNECTED");
    console.log("[STOMP] Disconnected and cleaned up");
  }

  subscribe<T>(topic: string, handler: (payload: T) => void): string {
    if (!this.client?.active) {
      console.warn(`[STOMP] Cannot subscribe to ${topic}: not connected`);
      // Store handler for later subscription when connected
      this.addPendingHandler(topic, handler as (payload: unknown) => void);
      return `pending-${topic}-${Date.now()}`;
    }

    const subscriptionId = `${topic}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const subscription = this.client.subscribe(
      topic,
      (message: IMessage) => {
        try {
          const payload = JSON.parse(message.body);
          handler(payload as T);
        } catch (error) {
          console.error(`[STOMP] Error parsing message from ${topic}:`, error);
        }
      },
      { id: subscriptionId },
    );

    this.subscriptions.set(subscriptionId, subscription);
    console.log(`[STOMP] Subscribed to ${topic} (${subscriptionId})`);

    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
      console.log(`[STOMP] Unsubscribed ${subscriptionId}`);
    }
  }

  private addPendingHandler(
    topic: string,
    handler: (payload: unknown) => void,
  ): void {
    if (!this.messageHandlers.has(topic)) {
      this.messageHandlers.set(topic, []);
    }
    this.messageHandlers.get(topic)!.push(handler);
  }

  private resubscribeAll(): void {
    // Resubscribe to all pending handlers
    this.messageHandlers.forEach((handlers, topic) => {
      handlers.forEach((handler) => {
        this.subscribe(topic, handler);
      });
    });
    this.messageHandlers.clear();

    console.log(`[STOMP] Resubscribed to ${this.subscriptions.size} topics`);

    // Notify reconnection listeners to re-fetch state
    this.reconnectCallbacks.forEach((cb) => cb());
  }

  // Track when last message was received
  updateLastMessageTimestamp(): void {
    this.lastMessageTimestamp = Date.now();
  }

  // Get last message timestamp (for detecting stale connection)
  getLastMessageTimestamp(): number {
    return this.lastMessageTimestamp;
  }

  // Register callback to run on successful reconnect
  onReconnect(callback: () => void): () => void {
    this.reconnectCallbacks.push(callback);
    return () => {
      this.reconnectCallbacks = this.reconnectCallbacks.filter(
        (cb) => cb !== callback,
      );
    };
  }

  // Send message (if needed in future)
  publish(destination: string, body: unknown): void {
    if (!this.client?.active) {
      console.warn(`[STOMP] Cannot publish to ${destination}: not connected`);
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }
}

// Export singleton instance
export const stompClient = StompWebSocketClient.getInstance();

// React-friendly hook helper
export function useStompClient() {
  return stompClient;
}
