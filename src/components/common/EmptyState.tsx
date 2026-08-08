import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 animate-fade-in">
      <div className="w-20 h-20 bg-cream-100 dark:bg-ink-800 rounded-full flex items-center justify-center text-ink-400 mb-4 animate-float">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-ink-800 dark:text-cream-100 text-center">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-ink-500 dark:text-ink-400 text-center mt-2 max-w-xs">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-6 py-2.5 bg-ink-800 dark:bg-cream-100 text-white dark:text-ink-800 font-medium rounded-full active:scale-95 transition-transform"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
