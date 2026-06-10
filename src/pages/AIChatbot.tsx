import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Bot, User } from "lucide-react";
import { cn } from "../lib/utils";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "model"; content: string };

type AiStatus = {
  online: boolean;
  reason: string;
  message: string;
  setupUrl?: string;
};

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Hello! I am SphereBot, your LearnSphere AI tutor. How can I help you with your learning today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/ai/status")
      .then((res) => res.json())
      .then((data: AiStatus) => setAiStatus(data))
      .catch(() =>
        setAiStatus({
          online: false,
          reason: "status_unavailable",
          message: "Could not check LearnSphere AI connection status.",
        }),
      );
  }, []);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.slice(1).map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, history }),
      });
      const data = await res.json();

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: data.response },
        ]);
        if (data.mode === "live" && aiStatus && !aiStatus.online) {
          setAiStatus({ ...aiStatus, online: true, message: "LearnSphere AI is connected." });
        }
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: `Error: ${data.error}` },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Failed to connect to the AI tutor." },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[calc(100vh-6rem)] max-h-[800px] bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden"
    >
      <div className="p-4 border-b border-slate-700 bg-slate-800 flex items-center gap-3">
        <div className="p-2 bg-indigo-900/40 text-indigo-400 rounded-lg">
          <Bot size={20} />
        </div>
        <div className="flex-1">
          <h2 className="font-display font-bold text-white">SphereBot Tutor</h2>
          <p className="text-xs text-slate-400">Powered by LearnSphere AI</p>
        </div>
        {aiStatus && (
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border",
              aiStatus.online
                ? "bg-emerald-900/30 border-emerald-500/40 text-emerald-400"
                : "bg-amber-900/30 border-amber-500/40 text-amber-300",
            )}
            title={aiStatus.message}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                aiStatus.online ? "bg-emerald-400" : "bg-amber-400",
              )}
            />
            {aiStatus.online ? "Online" : "Guided mode"}
          </div>
        )}
      </div>

      {aiStatus && !aiStatus.online && (
        <div className="px-4 py-3 bg-amber-900/20 border-b border-amber-500/30 text-xs text-amber-200 leading-relaxed">
          {aiStatus.message}
          {aiStatus.setupUrl && (
            <>
              {" "}
              <a
                href={aiStatus.setupUrl}
                target="_blank"
                rel="noreferrer"
                className="underline text-amber-100 hover:text-white"
              >
                Get API key
              </a>
            </>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3 max-w-[80%]",
              msg.role === "user" ? "ml-auto flex-row-reverse" : "",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === "user"
                  ? "bg-slate-700 text-slate-300"
                  : "bg-indigo-900/40 text-indigo-400",
              )}
            >
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={cn(
                "p-3 rounded-2xl text-sm",
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "bg-slate-700/50 border border-slate-600 text-slate-200 rounded-tl-sm",
              )}
            >
              <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-code:text-indigo-300 prose-strong:text-white">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-indigo-900/40 text-indigo-400 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-slate-700/50 border border-slate-600 rounded-tl-sm flex gap-1">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
              <div
                className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your courses..."
            className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans text-slate-200 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
