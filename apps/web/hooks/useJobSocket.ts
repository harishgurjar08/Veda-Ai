import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface UseJobSocketProps {
  assignmentId: string | null;
}

export function useJobSocket({ assignmentId }: UseJobSocketProps) {
  const [stage, setStage] = useState<string>('Initializing...');
  const [percentage, setPercentage] = useState<number>(0);
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
    console.log(`🔌 Connecting to WebSocket server at: ${wsUrl}`);
    
    const socket: Socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('🔌 Connected to Socket.io server. Joining assignment channel:', assignmentId);
      socket.emit('join', { assignmentId });
      
      // Fetch initial status via REST API just in case we are reconnecting or missed events
      axios.get(`${wsUrl}/api/assignments/${assignmentId}`)
        .then(res => {
          const data = res.data;
          setStatus(data.status);
          if (data.status === 'completed') {
            setPercentage(100);
            setStage('Finalizing your question paper...');
          } else if (data.status === 'failed') {
            setStage('Generation failed');
            setStatus('failed');
          }
        })
        .catch(err => {
          console.warn('Failed to fetch initial status during WS connect:', err);
        });
    });

    socket.on('job:progress', (data: { jobId: string, stage: string, percentage: number }) => {
      console.log('🔌 Received job progress:', data);
      setStage(data.stage);
      setPercentage(data.percentage);
      setStatus('processing');
    });

    socket.on('job:complete', (data: { jobId: string, assignmentId: string }) => {
      console.log('🔌 Job complete:', data);
      setPercentage(100);
      setStage('Paper generated successfully!');
      setStatus('completed');
    });

    socket.on('job:failed', (data: { jobId: string, error: string }) => {
      console.log('🔌 Job failed:', data);
      setStage('Generation failed');
      setStatus('failed');
      setError(data.error || 'AI generation failed');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    return () => {
      console.log('🔌 Disconnecting socket...');
      socket.disconnect();
    };
  }, [assignmentId]);

  return { stage, percentage, status, error };
}
