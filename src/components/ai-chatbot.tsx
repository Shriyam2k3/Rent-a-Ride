"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Loader2,
  Trash2,
  Bot,
  User,
  ChevronDown,
  Car,
  HelpCircle,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

export default function AiChatbot() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialWelcome =
    language === "hi"
      ? "नमस्ते! मैं रेंट-ए-राइड का एआई सहायक हूँ। हमारी गाड़ियों, ₹ में किराए, प्रयागराज एवं यूपी के पिकअप हब या बुकिंग के नियमों के बारे में आप कुछ भी पूछ सकते हैं!"
      : language === "hinglish"
      ? "Namaste! Main aapka Rent-a-Ride AI Concierge hoon. Prayagraj hubs, car rates in ₹, ya booking procedure ke baare me koi bhi sawal poochein!"
      : "Welcome to Rent-a-Ride! I am your AI mobility concierge powered by Llama 3.3. Ask me anything about our fleet, rates in ₹, Prayagraj & UP stations, or how to reserve a vehicle.";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-welcome",
      role: "assistant",
      content: initialWelcome,
      time: "Just now",
    },
  ]);

  const quickPrompts = [
    { label: "Cars in Prayagraj", query: "What cars are available in Prayagraj and what are their rates?" },
    { label: "BMW 3 Series Rate", query: "How much does the BMW 3 Series cost per day and what are its features?" },
    { label: "Booking Process", query: "How do I book a car on Rent a Ride and what documents are required?" },
    { label: "Cancellation Policy", query: "What is the cancellation and refund policy?" },
    { label: "हिंदी में जानकारी", query: "प्रयागराज में कौन सी गाड़ियाँ उपलब्ध हैं और किराए की क्या दरें हैं?" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: "u-" + Date.now(),
      role: "user",
      content: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        throw new Error("Unable to reach AI concierge");
      }

      const data = await res.json();
      const assistantMsg: Message = {
        id: "a-" + Date.now(),
        role: "assistant",
        content: data.reply || "I am here to help you with your Rent-a-Ride reservations.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorMsg: Message = {
        id: "err-" + Date.now(),
        role: "assistant",
        content:
          "I apologize, but I am momentarily reconnecting to our fleet intelligence. You can reach our 24/7 helpline at 1800-555-RIDE or ask again shortly.",
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
        id: "m-welcome-" + Date.now(),
        role: "assistant",
        content: initialWelcome,
        time: "Just now",
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden">
      {/* Floating Trigger Bubble Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#101827] to-[#172033] hover:from-[#172033] hover:to-[#101827] text-white shadow-xl hover:shadow-2xl border border-slate-700/80 transition-all duration-200 hover:scale-105 cursor-pointer"
          aria-label="Open AI Mobility Concierge"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#101827]" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-bold leading-tight">AI Concierge</span>
            <span className="text-[10px] text-emerald-400 font-semibold leading-tight">
              Instant Answers
            </span>
          </div>
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[410px] h-[550px] max-h-[85vh] bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#101827] to-[#172033] text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-xs tracking-tight text-white">
                    Rent-a-Ride AI Concierge
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Llama 3.3
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Online • Ask anything about our fleet</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClear}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick prompt suggestions bar */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
              Suggestions:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p.query)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
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
                        ? "bg-slate-900 text-white"
                        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800"
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-[#101827] text-white rounded-tr-xs shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/60 shadow-2xs"
                    }`}
                  >
                    <p className="text-xs">{m.content}</p>
                    <span
                      className={`text-[9px] block text-right mt-1 ${
                        isUser ? "text-slate-400" : "text-slate-400 dark:text-slate-500"
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
                <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0 border border-emerald-200/60 dark:border-emerald-800">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 rounded-2xl rounded-tl-xs px-4 py-3 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
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
            className="p-3 bg-white dark:bg-[#111827] border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cars, rates in ₹, Prayagraj hubs..."
              disabled={loading}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 dark:focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-[#101827] dark:bg-emerald-600 hover:bg-[#172033] dark:hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-emerald-400 dark:text-white" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
