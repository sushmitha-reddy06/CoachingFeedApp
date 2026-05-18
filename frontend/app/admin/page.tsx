"use client";

import { useState } from 'react';
import { createFeed } from '../../services/api';
import toast from 'react-hot-toast';
import { Send, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ title?: string; message?: string }>({});

  const validateForm = () => {
    const errors: { title?: string; message?: string } = {};
    if (title.length < 3) errors.title = 'Title must be at least 3 characters.';
    if (title.length > 100) errors.title = 'Title must be less than 100 characters.';
    if (message.length < 5) errors.message = 'Message must be at least 5 characters.';
    if (message.length > 500) errors.message = 'Message must be less than 500 characters.';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the validation errors.');
      return;
    }

    setLoading(true);
    try {
      await createFeed({ title, message });
      toast.success('Feed created successfully!');
      setTitle('');
      setMessage('');
      setValidationErrors({});
    } catch (error: any) {
      if (error.response?.data?.details) {
        // Handle express-validator errors
        const errs = error.response.data.details.reduce((acc: any, err: any) => {
          acc[err.path] = err.msg;
          return acc;
        }, {});
        setValidationErrors(errs);
        toast.error('Validation failed');
      } else {
        toast.error(error.response?.data?.error || 'Failed to create feed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 max-w-[700px]">
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10">
        <h1 className="text-[28px] font-extrabold text-gray-900 mb-1">Add New Feed</h1>
        <p className="text-[15px] text-gray-500 mb-8">Share a new message with your team</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-[15px] font-bold text-gray-800 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-[15px] placeholder-gray-400 ${
                validationErrors.title 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-gray-200 focus:border-indigo-600 focus:ring-indigo-600/20'
              }`}
              placeholder="Enter title"
              disabled={loading}
              maxLength={100}
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-[15px] font-bold text-gray-800 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-[15px] placeholder-gray-400 resize-none ${
                validationErrors.message 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-gray-200 focus:border-indigo-600 focus:ring-indigo-600/20'
              }`}
              placeholder="Enter your message"
              disabled={loading}
            />
            {validationErrors.message && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Post Feed</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
