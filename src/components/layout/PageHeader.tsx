import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightContent?: ReactNode;
  className?: string;
}

export default function PageHeader({ 
  title, 
  subtitle, 
  showBack = false, 
  rightContent,
  className = '' 
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-40 safe-top bg-warm-50/80 dark:bg-gray-900/80 glass ${className}`}>
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors -ml-2"
            >
              <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h1>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {rightContent || (
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors -mr-2">
            <MoreHorizontal size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        )}
      </div>
    </header>
  );
}
