import { useEffect, useRef, useState } from 'react';
import { useAssignmentStore } from '../store/assignmentStore';
import { useRouter } from 'next/navigation';

export const useAssignmentSocket = (assignmentId: string | null) => {
  const ws = useRef<WebSocket | null>(null);
  const router = useRouter();
  const { setJobStatus, setJobError, setWsConnected } = useAssignmentStore();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!assignmentId) return;

    const connect = () => {
      const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || (typeof window !== 'undefined' ? `${protocol}//${window.location.host}/ws` : 'ws://localhost:3001/ws');
      ws.current = new WebSocket(`${wsUrl}?assignmentId=${assignmentId}`);

      ws.current.onopen = () => {
        setWsConnected(true);
        setRetryCount(0);
        ws.current?.send(JSON.stringify({ event: 'subscribe', payload: { assignmentId } }));
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.event) {
            case 'job:queued':
              setJobStatus('pending');
              break;
            case 'job:processing':
              setJobStatus('processing', data.payload.progress, data.payload.step);
              break;
            case 'job:completed':
              setJobStatus('completed');
              router.push(`/assignments/${assignmentId}/paper`);
              break;
            case 'job:failed':
              setJobStatus('failed');
              setJobError(data.payload.error || 'Generation failed');
              break;
          }
        } catch (err) {
          console.error("WS parse error", err);
        }
      };

      ws.current.onclose = () => {
        setWsConnected(false);
        if (retryCount < 5) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            connect();
          }, Math.pow(2, retryCount) * 1000);
        }
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [assignmentId, retryCount, router, setJobStatus, setJobError, setWsConnected]);

  return null;
};
