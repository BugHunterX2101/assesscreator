'use client';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export const useGlobalSocket = () => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    let retryCount = 0;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || (typeof window !== 'undefined' ? `wss://${window.location.host}/ws` : 'ws://localhost:3001/ws');
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        retryCount = 0;
        ws.current?.send(JSON.stringify({ event: 'subscribe:global', payload: {} }));
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.event === 'notification') {
            if (data.payload.type === 'success') {
              toast.success(data.payload.message, { duration: 4000 });
            } else if (data.payload.type === 'error') {
              toast.error(data.payload.message, { duration: 4000 });
            } else {
              toast(data.payload.message);
            }
          }
        } catch (err) {
          console.error("Global WS parse error", err);
        }
      };

      ws.current.onclose = () => {
        if (retryCount < 5) {
          reconnectTimeout = setTimeout(() => {
            retryCount++;
            connect();
          }, Math.pow(2, retryCount) * 1000);
        }
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return null;
};
