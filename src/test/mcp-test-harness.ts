import { EventEmitter } from 'events';

interface MCPMessage {
  jsonrpc: '2.0';
  id?: number;
  method?: string;
  params?: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export class MCPTestHarness {
  private messageEmitter = new EventEmitter();
  private responses: MCPMessage[] = [];
  private messageQueue: MCPMessage[] = [];
  private isConnected = false;

  // Mock client implementation
  async connect(): Promise<MCPMessage> {
    if (this.isConnected) {
      throw new Error('Already connected');
    }
    this.isConnected = true;
    return this.sendInitialize();
  }

  async sendInitialize(): Promise<MCPMessage> {
    const initMessage: MCPMessage = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        capabilities: {
          sampling: {},
          roots: { listChanged: true }
        }
      }
    };
    
    return this.sendMessage(initMessage);
  }

  async sendMessage(message: MCPMessage): Promise<MCPMessage> {
    if (!this.isConnected) {
      throw new Error('Not connected');
    }

    this.messageEmitter.emit('message', message);
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Message timeout'));
      }, 5000);

      const handler = (response: MCPMessage) => {
        if (response.id === message.id) {
          clearTimeout(timeout);
          this.messageEmitter.off('response', handler);
          resolve(response);
        }
      };

      this.messageEmitter.on('response', handler);
    });
  }

  // Server response handling
  onServerMessage(message: MCPMessage): void {
    this.responses.push(message);
    this.messageEmitter.emit('response', message);
  }

  // Test utilities
  async waitForNotification(method: string, timeout = 5000): Promise<MCPMessage> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for ${method} notification`));
      }, timeout);

      const checkResponses = () => {
        const notification = this.responses.find(r => 
          r.method === method && !r.id
        );
        if (notification) {
          clearTimeout(timer);
          this.messageEmitter.off('response', checkResponses);
          resolve(notification);
        }
      };

      this.messageEmitter.on('response', checkResponses);
      checkResponses(); // Check existing responses
    });
  }

  clearResponses(): void {
    this.responses = [];
    this.messageQueue = [];
    this.isConnected = false;
    this.messageEmitter.removeAllListeners();
  }
} 