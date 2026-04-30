"use client";

import { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import { getSupportMessages, sendSupportMessage } from "@/lib/actions/support";

interface Message {
  id: number;
  content: string | null;
  imageUrl: string | null;
  isAdminReply: boolean;
  created_at: string;
}

export function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSupportMessages().then((data) => {
      setMessages(data.messages as Message[]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);

    const optimistic: Message = {
      id: Date.now(),
      content: input.trim(),
      imageUrl: null,
      isAdminReply: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    const msg = await sendSupportMessage(input.trim());
    if (msg) {
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? (msg as Message) : m))
      );
    }

    setSending(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-[600px]">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">Support Chat</h3>
        <p className="text-sm text-gray-500">
          Send a message and we&apos;ll respond within 24 hours
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isAdminReply ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.isAdminReply
                    ? "bg-gray-100 text-gray-900"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {msg.content && <p className="text-sm">{msg.content}</p>}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Attachment"
                    className="max-w-full rounded-lg mt-2"
                  />
                )}
                <p
                  className={`text-xs mt-1 ${msg.isAdminReply ? "text-gray-400" : "text-indigo-200"}`}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
