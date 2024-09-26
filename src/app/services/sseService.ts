type SSEEventCallback = (data: any) => void;

class SSEService {
  private eventSource: EventSource | null = null;
  private eventCallbacks: { [key: string]: SSEEventCallback[] } = {};

  connect(url: string) {
    this.disconnect(); // 기존 연결이 있다면 먼저 끊습니다.
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log("SSE connection opened");
    };

    this.eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      this.reconnect(url);
    };

    // 등록된 모든 이벤트에 대해 리스너 추가
    Object.keys(this.eventCallbacks).forEach((eventName) => {
      this.eventSource!.addEventListener(
        eventName,
        this.handleEvent(eventName)
      );
    });
  }

  private handleEvent = (eventName: string) => (event: MessageEvent) => {
    const callbacks = this.eventCallbacks[eventName] || [];
    callbacks.forEach((callback) => callback(JSON.parse(event.data)));
  };

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  private reconnect(url: string) {
    this.disconnect();
    console.log("Attempting to reconnect...");
    setTimeout(() => this.connect(url), 5000);
  }

  on(eventName: string, callback: SSEEventCallback) {
    if (!this.eventCallbacks[eventName]) {
      this.eventCallbacks[eventName] = [];
    }
    this.eventCallbacks[eventName].push(callback);

    // 이미 연결된 상태라면 새 이벤트 리스너를 추가합니다.
    if (this.eventSource) {
      this.eventSource.addEventListener(eventName, this.handleEvent(eventName));
    }
  }

  off(eventName: string, callback: SSEEventCallback) {
    const callbacks = this.eventCallbacks[eventName];
    if (callbacks) {
      this.eventCallbacks[eventName] = callbacks.filter(
        (cb) => cb !== callback
      );
    }
  }
}

export const sseService = new SSEService();
