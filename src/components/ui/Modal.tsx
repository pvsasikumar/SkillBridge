import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  if (!open) return null;

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative glass-card shadow-xl w-full animate-in fade-in zoom-in-95', sizes[size])}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-light">
            <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
