"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io('http://localhost:3000', {
        cors: {
          origin: [
            'http://localhost:3000',
            'https://trainee-warden-24t2-keyword.vercel.app',
            'http://localhost:3001',
            'https://warden-games.vercel.app',
          ],
          methods: ['GET', 'POST'],
        },
      });

      socket.current.on('connect', () => {
        console.log('Connected to socket:', socket.current.id);
        setIsSocketReady(true);
      });

      socket.current.on('disconnect', () => {
        console.log('Disconnected from socket');
        setIsSocketReady(false);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  if (!isSocketReady) {
    return null; // You can return a loader here if desired
  }

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
