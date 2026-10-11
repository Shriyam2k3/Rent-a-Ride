"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, User, Loader2, Trash2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-1",
      role: "assistant",
      content:
        "Namaste! I am your Rent-a-Ride AI Concierge. How can I assist your luxury mobility journey across Prayagraj, Lucknow, or Varanasi today?",
      time: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const history = messages.slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          conversationHistory: history,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content:
            data.response ||
            "Our fleet specialist can assist you directly at 1800-555-RIDE.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error("Chat service unavailable");
      }
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "I am currently coordinating dispatch queries. You can also contact our executive support team directly via our 24/7 hotline at 1800-555-7433.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: "assistant",
        content: "Conversation cleared. Feel free to ask about vehicle availability or express drop-offs across UP.",
        time: "Just now",
      },
    ]);
  };

  const quickPrompts = [
    { label: "Prayagraj Hub", query: "Where is the Prayagraj pickup hub located and what are the operating hours?" },
    { label: "DigiLocker KYC", query: "How does the 45-second DigiLocker verification work?" },
    { label: "Best SUV for NH-19", query: "Which luxury SUV is recommended for the Purvanchal expressway?" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Bubble Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-white text-[#18251D] shadow-lg hover:shadow-xl border border-[#DDE6DF] transition-all duration-300 hover:scale-105 cursor-pointer"
          aria-label="Open AI Mobility Concierge"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#EEF5EF] text-[#173F2D] flex items-center justify-center border border-[#DDE6DF]">
              <Bot className="w-4 h-4 text-[#173F2D]" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#237447] ring-2 ring-white animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-bold leading-tight text-[#18251D]">AI Concierge</span>
            <span className="text-[10px] text-[#237447] font-bold leading-tight">
              Fleet Assistant
            </span>
          </div>
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh] bg-white rounded-2xl border border-[#DDE6DF] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-[#18251D]">
          {/* Header */}
          <div className="bg-[#F7FAF7] text-[#18251D] px-5 py-4 flex items-center justify-between border-b border-[#DDE6DF] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#173F2D] text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-xs tracking-tight text-[#18251D]">
                    Rent-a-Ride AI Concierge
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#EEF5EF] text-[#173F2D] border border-[#DDE6DF]">
                    Llama 3.3
                  </span>
                </div>
                <p className="text-[10px] text-[#66736A] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#237447] animate-pulse" />
                  <span>Online • Ask anything about our UP fleet</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClear}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-[#66736A] hover:text-[#18251D] hover:bg-white transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 rounded-lg text-[#66736A] hover:text-[#18251D] hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick prompt suggestions bar */}
          <div className="px-3 py-2 bg-[#F7FAF7] border-b border-[#DDE6DF] overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
            <span className="text-[10px] font-bold text-[#173F2D] uppercase tracking-wider pl-1 shrink-0">
              Suggestions:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p.query)}
                className="px-2.5 py-1 rounded-full bg-white border border-[#DDE6DF] text-[11px] font-semibold text-[#66736A] hover:border-[#173F2D] hover:text-[#173F2D] whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-white">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 ${
                      isUser
                        ? "bg-[#173F2D] text-white"
                        : "bg-[#EEF5EF] text-[#173F2D] border border-[#DDE6DF]"
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-[#173F2D] text-white rounded-tr-xs shadow-xs"
                        : "bg-[#F7FAF7] text-[#18251D] rounded-tl-xs border border-[#DDE6DF] shadow-xs"
                    }`}
                  >
                    <p className="text-xs">{m.content}</p>
                    <span
                      className={`text-[9px] block text-right mt-1 ${
                        isUser ? "text-emerald-100" : "text-[#66736A]"
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#EEF5EF] text-[#173F2D] flex items-center justify-center font-bold shrink-0 border border-[#DDE6DF]">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#F7FAF7] text-[#66736A] rounded-2xl rounded-tl-xs px-4 py-3 border border-[#DDE6DF] flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#173F2D]" />
                  <span className="text-xs">Consulting Rent-a-Ride fleet intelligence...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#F7FAF7] border-t border-[#DDE6DF] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cars, rates in ₹, Prayagraj hubs..."
              disabled={loading}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#DDE6DF] text-xs text-[#18251D] placeholder:text-[#66736A] focus:outline-hidden focus:border-[#173F2D]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
