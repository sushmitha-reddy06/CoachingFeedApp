"use client";

import { useFeeds } from '../hooks/useFeeds';
import FeedCard from '../components/FeedCard';
import { Loader2, Zap, RefreshCw } from 'lucide-react';

export default function Home() {
  const { feeds, loading, error, refetch } = useFeeds();

  return (
    <div className="mt-4 max-w-[1100px] mx-auto">
      <div className="mb-8">
        <h1 className="text-[32px] font-extrabold text-gray-900 tracking-tight">Coaching Feed</h1>
        <p className="text-gray-500 text-[15px] mt-1">Realtime updates from your coaching team</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full flex flex-col space-y-4 relative pb-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="mt-4 text-gray-500 font-medium">Loading feeds...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-8 rounded-xl shadow-sm text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-red-500 text-xl font-bold">!</span>
              </div>
              <h3 className="text-red-800 font-bold mb-2 text-lg">Unable to load feeds</h3>
              <p className="text-red-600 mb-6 max-w-sm text-sm">{error}</p>
              <button 
                onClick={refetch}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          ) : feeds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📭</span>
              </div>
              <h2 className="text-xl font-bold text-gray-700 mb-2">No feeds yet</h2>
              <p className="text-gray-500">There are currently no updates. Add one from the admin panel!</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 relative z-10 bg-slate-50">
                {feeds.map((feed) => (
                  <FeedCard 
                    key={feed.id} 
                    title={feed.title} 
                    message={feed.message} 
                    createdAt={feed.createdAt} 
                  />
                ))}
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                 <span className="text-xs font-semibold text-gray-500">Realtime updates enabled</span>
              </div>
            </>
          )}
        </div>

        <div className="w-full lg:w-[320px] shrink-0 sticky top-24">
          <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
              This is a realtime coaching feed. New messages appear instantly without refreshing the page.
            </p>
            
            <div className="bg-indigo-50/70 border border-indigo-100/50 rounded-xl p-5 flex items-start space-x-4">
              <Zap className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[15px] font-bold text-indigo-700 mb-1">Realtime Active</h4>
                <p className="text-sm text-indigo-900/70 leading-relaxed">
                  You will see new feeds as soon as they are added.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
