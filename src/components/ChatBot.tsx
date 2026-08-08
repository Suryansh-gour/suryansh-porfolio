import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Bot,
  MessageSquare,
  Mic,
  MicOff,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Square,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
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

const messageText = (message: UIMessage) =>
  message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");

/** Animated bars shown while the assistant speaks. */
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-4" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-primary"
          animate={
            active
              ? { height: ["25%", "100%", "45%", "85%", "30%"] }
              : { height: "25%" }
          }
          transition={
            active
              ? { duration: 0.9, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }
              : { duration: 0.2 }
          }
          style={{ height: "25%" }}
        />
      ))}
    </div>
  );
}

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

  const [voiceMode, setVoiceMode] = useState(false);
  const [muted, setMuted] = useState(false);
  const spokenIdsRef = useRef<Set<string>>(new Set());

  const {
    sttSupported,
    listening,
    speaking,
    interim,
    voiceError,
    setVoiceError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoiceAssistant();

  // Keep parent thread.messages in sync with this chat's local messages.
  useEffect(() => {
    if (messages !== thread.messages) {
      onUpdateMessages(messages);
    }
  }, [messages, thread.messages, onUpdateMessages]);

  const isLoading = status === "submitted" || status === "streaming";

  const submitText = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || isLoading) return;
      sendMessage({ text: value });
    },
    [isLoading, sendMessage],
  );

  const handleSubmit = useCallback(
    ({ text }: { text: string }) => submitText(text),
    [submitText],
  );

  // Speak new assistant replies once streaming finishes (voice mode only).
  const lastAssistant = useMemo(
    () => [...messages].reverse().find((m) => m.role === "assistant"),
    [messages],
  );

  useEffect(() => {
    if (!voiceMode || muted || isLoading || !lastAssistant) return;
    if (spokenIdsRef.current.has(lastAssistant.id)) return;
    const text = messageText(lastAssistant);
    if (!text.trim()) return;
    spokenIdsRef.current.add(lastAssistant.id);
    void speak(text);
  }, [voiceMode, muted, isLoading, lastAssistant, speak]);

  const toggleMic = useCallback(() => {
    if (listening) {
      stopListening();
      return;
    }
    startListening((text) => submitText(text));
  }, [listening, startListening, stopListening, submitText]);

  const replay = useCallback(() => {
    if (!lastAssistant) return;
    const text = messageText(lastAssistant);
    if (text.trim()) void speak(text);
  }, [lastAssistant, speak]);

  const statusLabel = listening
    ? "Listening..."
    : isLoading
      ? "Thinking..."
      : speaking
        ? "Speaking..."
        : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <Conversation className="h-full">
          <ConversationContent className="gap-5 px-4 py-5">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<Bot className="size-6 text-primary" />}
                title="How can I help you?"
                description="Ask me about Suryansh's skills, projects, education or experience — type or tap the mic."
              />
            ) : (
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    <MessageResponse>{messageText(message)}</MessageResponse>
                  </MessageContent>
                </Message>
              ))
            )}
            {interim && (
              <Message from="user">
                <MessageContent>
                  <span className="text-sm italic opacity-70">{interim}</span>
                </MessageContent>
              </Message>
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

      <div className="border-t border-[var(--card-border)] p-3 sm:p-4 bg-[var(--card-bg)] space-y-2">
        {/* Voice control bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setVoiceMode((v) => {
                if (v) stopSpeaking();
                return !v;
              });
              setVoiceError(null);
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors",
              voiceMode
                ? "bg-primary/15 text-primary"
                : "bg-[var(--muted)] text-[var(--text-muted)] hover:text-[var(--foreground)]",
            )}
            aria-pressed={voiceMode}
          >
            <Volume2 size={13} /> Voice mode {voiceMode ? "on" : "off"}
          </button>

          {voiceMode && (
            <>
              <button
                type="button"
                onClick={() => {
                  setMuted((m) => {
                    if (!m) stopSpeaking();
                    return !m;
                  });
                }}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold bg-[var(--muted)] text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                aria-pressed={muted}
              >
                {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                {muted ? "Unmute" : "Mute"}
              </button>
              <button
                type="button"
                onClick={replay}
                disabled={!lastAssistant}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold bg-[var(--muted)] text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-40"
              >
                <RotateCcw size={13} /> Replay
              </button>
              {speaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold bg-red-500/10 text-red-500 transition-colors"
                >
                  <Square size={12} /> Stop
                </button>
              )}
            </>
          )}

          {statusLabel && (
            <span className="ml-auto flex items-center gap-2 text-[11px] font-semibold text-primary">
              {speaking && <Waveform active />}
              {statusLabel}
            </span>
          )}
        </div>

        {(error || voiceError) && (
          <div className="text-[11px] text-red-500">
            {voiceError ?? "Something went wrong. Please try again."}
          </div>
        )}

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={toggleMic}
            disabled={!sttSupported}
            aria-label={listening ? "Stop listening" : "Speak your question"}
            className={cn(
              "relative shrink-0 flex items-center justify-center w-11 h-11 rounded-full transition-colors",
              listening
                ? "bg-red-500 text-white"
                : "bg-[var(--muted)] text-[var(--text-muted)] hover:text-primary",
              !sttSupported && "opacity-40 cursor-not-allowed",
            )}
          >
            {listening && (
              <motion.span
                className="absolute inset-0 rounded-full bg-red-500/40"
                animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
            {sttSupported ? <Mic size={18} /> : <MicOff size={18} />}
          </button>

          <div className="flex-1 min-w-0">
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
    () => getInitialThreads()[0]!.id
  );
  const [showSidebar, setShowSidebar] = useState(false);

  // Ensure the initial active id matches the initial thread.
  useEffect(() => {
    setActiveThreadId((id) => (threads.some((t) => t.id === id) ? id : threads[0]!.id));
  }, [threads]);

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
    const text = messageText(firstUser);
    const title = text.trim().slice(0, 30) || "New chat";
    if (title !== "New chat") updateThreadTitle(activeThreadId, title);
  }, [threads, activeThreadId, updateThreadTitle]);

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
              "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-[var(--card-border)] shadow-2xl",
              "bg-[var(--card-bg)] text-[var(--foreground)]",
              "w-[calc(100vw-2rem)] sm:w-[420px] h-[min(600px,80vh)]"
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
                    Suryansh&apos;s AI Assistant
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    Ask or talk — voice enabled
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
