import { useState, useEffect, useCallback, useRef } from 'react';
import { getFeeds } from '../services/api';
import { socketClient } from '../socket/socketClient';
import toast from 'react-hot-toast';

export interface Feed {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

export function useFeeds() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFeeds(); // Now returns { feeds: [], totalItems, ... }
      setFeeds(data.feeds || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch feeds');
      toast.error('Failed to load feeds');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeeds();

    const socket = socketClient.connect();

    const handleNewFeed = (newFeed: Feed) => {
      setFeeds((prevFeeds) => {
        // Prevent duplicate feeds
        const exists = prevFeeds.some((feed) => feed.id === newFeed.id);
        if (exists) return prevFeeds;

        toast.success(`New feed: ${newFeed.title}`);
        return [newFeed, ...prevFeeds];
      });
    };

    socket.on('newFeed', handleNewFeed);

    return () => {
      socket.off('newFeed', handleNewFeed);
    };
  }, [fetchFeeds]);

  return { feeds, loading, error, refetch: fetchFeeds };
}
