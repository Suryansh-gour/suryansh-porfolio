import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Bot,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { cn } from "@/lib/utils";

const transport = new DefaultChatTransport({ api: "/api/chat" });

interface Thread {
  id: string;
  title: string;
  messages: UIMessage[];
}

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const getInitialThreads = (): Thread[] => [
  { id: generateId(), title: "New chat", messages: [] },
];

const ChatWindow = React.memo(function ChatWindow({
  thread,
  onUpdateMessages,
}: {
  thread: Thread;
  onUpdateMessages: (messages: UIMessage[]) => void;
}) {
  const { messages, status, error, sendMessage, stop } = useChat({
    id: thread.id,
    messages: thread.messages,
    transport,
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  // Keep parent thread.messages in sync with this chat's local messages.
  useEffect(() => {
    if (messages !== thread.messages) {
      onUpdateMessages(messages);
    }
  }, [messages, thread.messages, onUpdateMessages]);

  const handleSubmit = useCallback(
    ({ text }: { text: string }) => {
      if (!text.trim() || status === "submitted" || status === "streaming") return;
      sendMessage({ text: text.trim() });
    },
    [sendMessage, status]
  );

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <Conversation className="h-full">
          <ConversationContent className="gap-5 px-4 py-5">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<Bot className="size-6 text-primary" />}
                title="How can I help you?"
                description="Ask me anything about Suryansh, his work, or general topics."
              />
            ) : (
              messages.map((message) => {
                const text = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => (part.type === "text" ? part.text : ""))
                  .join("");
                return (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      <MessageResponse>{text}</MessageResponse>
                    </MessageContent>
                  </Message>
                );
              })
            )}
            {isLoading && messages.length > 0 && messages.at(-1)?.role === "user" && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer as="span" className="text-sm">
                    Thinking...
                  </Shimmer>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <div className="border-t border-[var(--card-border)] p-4 bg-[var(--card-bg)]">
        {error && (
          <div className="mb-2 text-xs text-red-500">
            {error.message || "Something went wrong. Please try again."}
          </div>
        )}
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            placeholder="Ask me anything..."
            className="min-h-12 max-h-40"
            disabled={isLoading}
          />
          <PromptInputFooter className="justify-end pt-2">
            <PromptInputSubmit
              status={status}
              onStop={stop}
              disabled={isLoading && status !== "streaming"}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
});

export default function ChatBot() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [isOpen, setIsOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>(getInitialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string>(
    getInitialThreads()[0]!.id
  );
  const [showSidebar, setShowSidebar] = useState(false);

  const activeThread = useMemo(
    () =>
      threads.find((t) => t.id === activeThreadId) ??
      threads[0] ??
      getInitialThreads()[0]!,
    [threads, activeThreadId]
  );

  const handleUpdateMessages = useCallback((messages: UIMessage[]) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, messages } : t))
    );
  }, [activeThreadId]);

  const createThread = useCallback(() => {
    const newThread: Thread = { id: generateId(), title: "New chat", messages: [] };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setShowSidebar(false);
  }, []);

  const deleteThread = useCallback(
    (id: string) => {
      setThreads((prev) => {
        const next = prev.filter((t) => t.id !== id);
        if (id === activeThreadId) {
          const fallback = next[0] ?? getInitialThreads()[0]!;
          setActiveThreadId(fallback.id);
        }
        return next.length > 0 ? next : getInitialThreads();
      });
    },
    [activeThreadId]
  );

  const updateThreadTitle = useCallback((id: string, title: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: title.slice(0, 40) } : t))
    );
  }, []);

  // Auto-title a thread once the first user message arrives.
  useEffect(() => {
    const thread = threads.find((t) => t.id === activeThreadId);
    if (!thread || thread.title !== "New chat") return;
    const firstUser = thread.messages.find((m) => m.role === "user");
    if (!firstUser) return;
    const text = firstUser.parts
      .filter((p) => p.type === "text")
      .map((p) => (p.type === "text" ? p.text : ""))
      .join(" ");
    const title = text.trim().slice(0, 30) || "New chat";
    updateThreadTitle(activeThreadId, title);
  }, [threads, activeThreadId]);

  if (!mounted) return null;

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-primary/20",
          "bg-gradient-to-br from-primary to-secondary text-white hover:brightness-110 transition-all",
          isOpen && "hidden"
        )}
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-[var(--card-border)] shadow-2xl",
              "bg-[var(--card-bg)] text-[var(--foreground)]",
              "w-[calc(100vw-2rem)] sm:w-[420px] h-[520px] max-h-[80vh]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)] bg-[var(--card-bg)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    Assistant
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    Powered by Lovable AI
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowSidebar((s) => !s)}
                  className="text-[var(--text-muted)]"
                  aria-label="Threads"
                >
                  <MoreHorizontal size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsOpen(false)}
                  className="text-[var(--text-muted)]"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Thread sidebar */}
            <AnimatePresence initial={false}>
              {showSidebar && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-[var(--card-border)] bg-[var(--muted)] overflow-hidden"
                >
                  <div className="p-3 max-h-48 overflow-y-auto space-y-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Threads
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={createThread}
                        className="text-[var(--text-muted)]"
                        aria-label="New thread"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    {threads.map((thread) => (
                      <div
                        key={thread.id}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm group",
                          thread.id === activeThreadId
                            ? "bg-primary/10 text-primary"
                            : "text-[var(--text-muted)] hover:bg-[var(--card-bg)]"
                        )}
                      >
                        <button
                          onClick={() => {
                            setActiveThreadId(thread.id);
                            setShowSidebar(false);
                          }}
                          className="flex-1 text-left truncate"
                        >
                          {thread.title}
                        </button>
                        {threads.length > 1 && (
                          <button
                            onClick={() => deleteThread(thread.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-red-500 transition-opacity"
                            aria-label={`Delete ${thread.title}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat window keyed by active thread */}
            <div className="flex-1 min-h-0">
              <ChatWindow
                key={activeThread.id}
                thread={activeThread}
                onUpdateMessages={handleUpdateMessages}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
