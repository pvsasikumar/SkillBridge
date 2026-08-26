import { useState, useRef, useEffect, useCallback } from 'react';
import Markdown from 'react-markdown';
import { Button } from '@/components/ui/Button';
import type { AIMessage, AIContext } from '@/types';
import { cn } from '@/lib/utils';

const suggestedPrompts = [
  'Explain this simply',
  'Give me an example',
  'Give me a practice question',
  'Give me a hint',
  'Explain my last mistake',
];

interface AITutorChatboxProps {
  context: AIContext;
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const WELCOME_TIMESTAMP = Date.now();

export function AITutorChatbox({
  context,
  className,
  isMobileOpen: _isMobileOpen,
  onMobileClose,
}: AITutorChatboxProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${context.student.name}! I'm your AI Tutor. I can help you understand **${context.currentTopic}** and work through ${context.currentLesson}. Ask me anything!`,
      timestamp: WELCOME_TIMESTAMP,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);

      const userMessage: AIMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      const conversation = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/ai/tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            context,
            conversation,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || `Server error (${res.status})`);
        }

        const data = await res.json();
        const aiMessage: AIMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        let errorMessage = 'Sorry, I could not connect to the AI Tutor right now. Please try again.';
        if (err instanceof Error) {
          if (err.message.includes('Invalid API key')) {
            errorMessage = 'AI Tutor is not configured. Please contact your administrator.';
          } else if (err.message.includes('Rate limit')) {
            errorMessage = 'Too many requests. Please wait a moment and try again.';
          } else if (err.message.includes('timed out') || err.message.includes('network')) {
            errorMessage = 'The request timed out. Please check your connection and try again.';
          } else if (err.message.includes('empty')) {
            errorMessage = 'AI Tutor returned an empty response. Please try rephrasing your question.';
          }
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages, context, isLoading]
  );

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const container = (
    <div
      className={cn(
        'flex flex-col h-full bg-surface',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-outline-light shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-primary-500">lightbulb</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">AI Tutor</p>
              <p className="text-xs text-on-surface-variant">Your personalized learning assistant</p>
            </div>
          </div>
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-xl hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[88%] px-3.5 py-2.5 rounded-2xl',
                msg.role === 'user'
                  ? 'gradient-btn text-white rounded-br-md'
                  : 'bg-surface-container text-on-surface rounded-bl-md'
              )}
            >
              {msg.role === 'assistant' ? (
                <div className="ai-markdown">
                  <Markdown>{msg.content}</Markdown>
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-container text-on-surface px-3.5 py-2.5 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] animate-spin text-primary-500">progress_activity</span>
                <span className="text-sm text-on-surface-variant">AI Tutor is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex justify-start">
            <div className="bg-danger-50 border border-danger-200 text-danger-600 px-3.5 py-2.5 rounded-2xl rounded-bl-md max-w-[88%]">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0">error</span>
                <p className="text-sm leading-relaxed">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      <div className="px-3 pb-2 pt-1 shrink-0">
        <div className="flex gap-1.5 flex-wrap">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handlePromptClick(prompt)}
              disabled={isLoading}
              className="px-2.5 py-1 bg-surface-container-low border border-outline-light rounded-full text-xs text-on-surface-variant hover:bg-surface-container hover:border-outline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-outline-light shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI Tutor anything..."
            rows={1}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2 bg-surface-container-low border border-outline-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none disabled:opacity-50 min-h-[38px] max-h-24"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 96) + 'px';
            }}
          />
          <Button
            variant="gradient"
            size="sm"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="h-[38px] w-[38px] px-0 shrink-0"
          >
            <span className="material-symbols-outlined text-[14px]">send</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return container;
}

/* Mobile toggle button for floating the chatbox */
export function AITutorToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'lg:hidden fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200',
        isOpen
          ? 'bg-on-surface text-surface hover:bg-gray-800'
          : 'gradient-btn text-white hover:opacity-90'
      )}
      aria-label={isOpen ? 'Close AI Tutor' : 'Open AI Tutor'}
    >
      {isOpen ? <span className="material-symbols-outlined text-[20px]">close</span> : <span className="material-symbols-outlined text-[20px]">auto_awesome</span>}
    </button>
  );
}
