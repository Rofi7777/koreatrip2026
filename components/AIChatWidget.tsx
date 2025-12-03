 "use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type MessageRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

const QUICK_PROMPTS = [
  { text: "📅 Lịch trình hôm nay?", label: "Today's schedule" },
  { text: "🍜 Ăn gì gần đây?", label: "What to eat nearby" },
  { text: "🛍️ Mua gì ở Myeongdong?", label: "Shopping in Myeongdong" },
  { text: "🚇 Cách đi từ đây đến Alpensia?", label: "Transport to Alpensia" },
];

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  const sendMessage = async (messageText?: string) => {
    const trimmed = messageText || input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setHasWelcomed(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const json = await res.json();

      const replyText: string =
        json.reply ??
        json.message ??
        "Xin lỗi, trợ lý đang gặp sự cố. Vui lòng thử lại sau.";

      const aiMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyText,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const aiMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          "Sorry, I had trouble reaching the server. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#6D28D9] to-[#7C3AED] text-white shadow-xl hover:animate-bounce focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6D28D9]"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[340px] sm:w-[360px] h-[460px] sm:h-[500px] rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-4 py-3 border-b border-purple-700/40 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] text-white">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇰🇷</span>
              <div>
                <h2 className="text-sm font-semibold">Super AI Guide</h2>
                <p className="text-[11px] text-violet-100">
                  Powered by Gemini 2.5 Flash
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-gray-50">
            {messages.length === 0 && !hasWelcomed && (
              <div className="mt-4 space-y-3">
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-3 border border-purple-100">
                  <p className="text-xs font-semibold text-purple-900 mb-1">
                    👋 Xin chào! I am your AI Guide
                  </p>
                  <p className="text-xs text-purple-700">
                    I know your schedule perfectly. Ask me anything about food, transport, or timing!
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600 px-1">
                    Quick questions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => sendMessage(prompt.text)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] sm:text-xs bg-white border border-purple-200 rounded-full text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                      >
                        {prompt.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 text-xs sm:text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-2xl rounded-tr-none"
                      : "bg-gray-100 text-gray-900 rounded-2xl rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <span className="inline-flex h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="inline-flex h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="inline-flex h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
              </div>
            )}
          </div>

          <form
            className="border-t border-gray-100 bg-white px-3 py-2 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the itinerary..."
              className="flex-1 border border-gray-200 rounded-full px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/40 focus:border-[#6D28D9]"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-full bg-[#6D28D9] text-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-[#5B21B6] disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}


