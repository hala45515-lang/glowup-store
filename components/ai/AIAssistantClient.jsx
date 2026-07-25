"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SUGGESTIONS = [
  "I have oily, acne-prone skin — build me a routine",
  "What's a good everyday lip color for fair skin?",
  "Recommend a fragrance under $70",
  "I want a glowy, no-makeup makeup look",
];

function MessageBubble({ role, content, index }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 4) * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-[#2C1810] text-white" : "bg-gradient-to-br from-[#C4614A] to-[#E8A598] text-white"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-[#2C1810] text-white rounded-tr-sm"
            : "bg-white border border-[#F2D4C8] text-[#2C1810] rounded-tl-sm shadow-sm"
        }`}
      >
        {content || (
          <span className="inline-flex items-center gap-1 text-[#C4897A]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> thinking…
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function AIAssistantClient() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        throw new Error(await res.text().catch(() => "Request failed"));
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages([...nextMessages, { role: "assistant", content: assistantText }]);
      }
    } catch (err) {
      toast.error("The AI assistant is unavailable right now. Please try again.");
      setMessages(nextMessages);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <section className="bg-[#FFF8F5] min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #2C1810, #3D2018, #2C1810)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(196,97,74,0.18), transparent 65%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-6 py-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 shadow-lg"
            style={{ background: "linear-gradient(135deg, #C4614A, #E8A598, #D4697A)" }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[32px] lg:text-[40px] font-black text-white leading-tight mb-2"
          >
            AI Beauty Assistant
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[14px] text-[#C4897A]"
          >
            Tell me about your skin, your concerns, or the look you&apos;re after.
          </motion.p>
        </div>
      </div>

      {/* Chat panel */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl border border-[#F2D4C8] shadow-sm overflow-hidden flex flex-col h-[65vh] min-h-[420px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
                <p className="text-[13px] text-[#7A4A3A]">Try asking:</p>
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  {SUGGESTIONS.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => sendMessage(s)}
                      className="text-left text-[13px] px-4 py-2.5 rounded-xl border border-[#F2D4C8] bg-[#FFF8F5] hover:border-[#C4614A] hover:text-[#C4614A] text-[#2C1810] transition-colors"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <MessageBubble key={i} role={m.role} content={m.content} index={i} />
                ))}
              </AnimatePresence>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-[#F2D4C8] p-4 flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skincare, makeup, or a routine…"
              disabled={loading}
              className="flex-1 text-[14px] px-4 py-3 rounded-full border border-[#E8C4B8] bg-[#FFF8F5] text-[#2C1810] placeholder:text-[#C4897A] focus:outline-none focus:border-[#C4614A] transition-colors disabled:opacity-60"
            />
            <motion.button
              type="submit"
              disabled={loading || !input.trim()}
              whileTap={{ scale: 0.92 }}
              className="shrink-0 w-11 h-11 rounded-full bg-[#C4614A] hover:bg-[#A84E39] disabled:opacity-40 disabled:pointer-events-none text-white flex items-center justify-center transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
}
