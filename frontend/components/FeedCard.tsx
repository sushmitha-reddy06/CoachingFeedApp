import { format, formatDistanceToNow } from 'date-fns';
import { Rocket, Target, BookOpen, Trophy } from 'lucide-react';
import { useMemo, memo } from 'react';

interface FeedCardProps {
  title: string;
  message: string;
  createdAt: string;
}

const icons = [Rocket, Target, BookOpen, Trophy];

const FeedCard = memo(function FeedCard({ title, message, createdAt }: FeedCardProps) {
  // Randomly select an icon based on title length just to have variation
  const Icon = useMemo(() => icons[title.length % icons.length], [title]);
  
  const date = new Date(createdAt);
  const isNew = (new Date().getTime() - date.getTime()) < 5 * 60 * 1000; // Less than 5 minutes old

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 p-5 flex hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200">
      <div className="mr-5 flex-shrink-0">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-500" strokeWidth={2} />
        </div>
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="text-[17px] font-bold text-gray-900 leading-tight mb-1">{title}</h3>
        <p className="text-[15px] text-gray-500 leading-relaxed pr-4">{message}</p>
      </div>

      <div className="flex flex-col items-end flex-shrink-0 pl-4 border-l border-gray-50 min-w-[120px]">
        <span className="text-sm font-semibold text-gray-700">
          {formatDistanceToNow(date, { addSuffix: true })}
        </span>
        <span className="text-xs text-gray-400 mt-1 mb-2">
          {format(date, 'MMM d, yyyy h:mm a')}
        </span>
        {isNew && (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 uppercase tracking-wide">
            New
          </span>
        )}
      </div>
    </div>
  );
});

export default FeedCard;
