"use client";

import { useEffect, useState, useRef } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { getSupportChats, getChatMessages, sendAdminReply } from "@/lib/actions/admin";

interface ChatPreview {
  user_id: string;
  user_name: string;
  user_email: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export function SupportDashboard() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSupportChats().then((data) => {
      setChats(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectChat = async (userId: string) => {
    setSelectedChat(userId);
    const msgs = await getChatMessages(userId);
    setMessages(msgs);
  };

  const handleReply = async () => {
    if (!input.trim() || !selectedChat) return;
    setSending(true);

    const msg = await sendAdminReply(selectedChat, input.trim());
    if (msg) {
      setMessages((prev) => [...prev, msg]);
    }

    setInput("");
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600" />
      </div>
    );
  }

  if (selectedChat) {
    const chatUser = chats.find((c) => c.user_id === selectedChat);

    return (
      <div className="flex flex-col h-[600px]">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <button
            onClick={() => setSelectedChat(null)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h3 className="font-bold text-gray-900">{chatUser?.user_name}</h3>
            <p className="text-xs text-gray-500">{chatUser?.user_email}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isAdminReply ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.isAdminReply
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.content && <p className="text-sm">{msg.content}</p>}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="attachment"
                    className="max-w-full rounded-lg mt-2"
                  />
                )}
                <p
                  className={`text-xs mt-1 ${msg.isAdminReply ? "text-green-200" : "text-gray-400"}`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type admin reply..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleReply()
              }
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl"
            />
            <button
              onClick={handleReply}
              disabled={sending || !input.trim()}
              className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Support Chats</h2>
      {chats.length === 0 ? (
        <p className="text-center py-12 text-gray-500">No support chats yet</p>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => (
            <button
              key={chat.user_id}
              onClick={() => selectChat(chat.user_id)}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition border border-gray-100 text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">
                    {chat.user_name}
                  </p>
                  {chat.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {chat.unread_count}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.last_message}
                </p>
              </div>
              <p className="text-xs text-gray-400 shrink-0 ml-4">
                {new Date(chat.last_message_time).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
