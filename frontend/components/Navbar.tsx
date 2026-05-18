"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { socketClient } from '../socket/socketClient';
import { MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

type ConnectionState = 'connected' | 'reconnecting' | 'disconnected';

export default function Navbar() {
  const pathname = usePathname();
  const [connState, setConnState] = useState<ConnectionState>('disconnected');

  useEffect(() => {
    const socket = socketClient.connect();

    const onConnect = () => {
      setConnState('connected');
      toast.success('Realtime connection established');
    };
    const onDisconnect = () => {
      setConnState('disconnected');
      toast.error('Connection lost');
    };
    const onReconnectAttempt = () => {
      setConnState('reconnecting');
      toast('Attempting to reconnect...', { icon: '🔄' });
    };
    const onReconnect = () => {
      setConnState('connected');
      toast.success('Successfully reconnected!');
    };

    if (socket.connected) {
      setConnState('connected');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.io.on('reconnect_attempt', onReconnectAttempt);
    socket.io.on('reconnect', onReconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.io.off('reconnect_attempt', onReconnectAttempt);
      socket.io.off('reconnect', onReconnect);
    };
  }, []);

  const getStatusColor = () => {
    switch (connState) {
      case 'connected': return 'bg-green-50 border-green-100 text-green-700 dot-green-500';
      case 'reconnecting': return 'bg-yellow-50 border-yellow-100 text-yellow-700 dot-yellow-500';
      case 'disconnected': return 'bg-red-50 border-red-100 text-red-700 dot-red-500';
    }
  };
  
  const statusClasses = getStatusColor();
  const dotColorClass = statusClasses.split(' ').find(c => c.startsWith('dot-'))?.replace('dot-', 'bg-');

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <MessageSquare className="w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-gray-900 tracking-wide">SYNCUP</span>
          <span className="text-gray-400 text-sm border-l border-gray-300 pl-3">Coaching Feed</span>
        </div>

        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className={`text-sm font-semibold h-16 flex items-center border-b-2 transition-colors ${
              pathname === '/' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
          <Link
            href="/admin"
            className={`text-sm font-semibold h-16 flex items-center border-b-2 transition-colors ${
              pathname === '/admin' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Admin
          </Link>
          
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${statusClasses.replace(/dot-[\w-]+/,'')}`}>
            <div className={`w-2 h-2 rounded-full ${dotColorClass}`}></div>
            <span className={`text-xs font-semibold capitalize`}>
              {connState}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
