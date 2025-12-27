import React, { useState, useEffect, useRef } from "react";
import { Search, Send, Image as ImageIcon, Loader2, X, Clock, MessageCircle, ChevronLeft } from "lucide-react";
import { Loading } from "../components";
import { useAdminSupport } from "../hooks/useAdminSupport";

const SupportDashboard: React.FC = () => {
  const {
    userChats,
    activeChatUserId,
    messages,
    loadingChats,
    loadingMessages,
    setActiveChatUserId,
    sendAdminReply,
    uploadImage,
  } = useAdminSupport();

  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [showMobileChat, setShowMobileChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectUser = (userId: string) => {
    setActiveChatUserId(userId);
    setShowMobileChat(true);
  };

  const activeUser = userChats.find((u) => u.user_id === activeChatUserId);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;
    if (!activeChatUserId) return;

    let imageUrl = "";
    if (selectedFile) {
      setIsUploading(true);
      imageUrl = (await uploadImage(selectedFile)) || "";
      setIsUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }

    await sendAdminReply(activeChatUserId, input.trim(), imageUrl);
    setInput("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removePreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const filteredChats = userChats.filter(
    (chat) =>
      chat.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.user_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loadingChats) return <Loading />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className={`
        ${showMobileChat ? 'hidden' : 'flex'} 
        w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-col md:flex
      `}>
        <div className="p-4 md:p-6 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Support Inbox</h2>
          <p className="text-xs text-gray-500 mt-1">{userChats.length} active conversations</p>

          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.user_id}
                onClick={() => handleSelectUser(chat.user_id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-indigo-50 transition-colors border-b border-gray-100 ${
                  activeChatUserId === chat.user_id ? "bg-indigo-50 border-l-4 border-l-indigo-600" : ""
                }`}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-full shrink-0 flex items-center justify-center text-indigo-600 font-bold">
                  {chat.user_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 truncate">{chat.user_name}</h4>
                    {chat.unread_count > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                        {chat.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">{chat.user_email}</p>
                  <p className="text-sm text-gray-600 mt-1 truncate font-medium">{chat.last_message}</p>
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 uppercase tracking-wider">
                    <Clock size={10} />
                    {new Date(chat.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className={`
        ${!showMobileChat ? 'hidden' : 'flex'} 
        flex-1 flex flex-col md:flex bg-white
      `}>
        {activeUser ? (
          <>
            <div className="px-4 py-3 md:p-4 bg-white border-b border-gray-200 flex items-center gap-3">
              <button 
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                {activeUser.user_name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{activeUser.user_name}</h3>
                <p className="text-xs text-gray-500 truncate">{activeUser.user_email}</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">
              {loadingMessages && (
                <div className="flex justify-center p-4">
                  <Loader2 className="animate-spin text-indigo-500" size={24} />
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.is_admin_reply ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-lg px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      msg.is_admin_reply
                        ? "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                        : "bg-indigo-600 text-white rounded-tr-none"
                    }`}
                  >
                    {msg.image_url && (
                      <a href={msg.image_url} target="_blank" rel="noreferrer">
                        <img
                          src={msg.image_url}
                          alt="Attachment"
                          className="rounded-lg mb-2 max-h-60 md:max-h-80 w-full object-cover cursor-zoom-in"
                        />
                      </a>
                    )}
                    <p className="leading-relaxed wrap-break-word">{msg.content}</p>
                    <p className={`text-[10px] mt-1.5 opacity-70 ${msg.is_admin_reply ? "text-gray-500" : "text-indigo-100"}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t p-3 md:p-4">
              {previewUrl && (
                <div className="mb-3 p-2 bg-gray-50 rounded-xl flex items-center gap-3">
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                    <button
                      onClick={removePreview}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <p className="text-xs font-medium text-gray-500 tracking-wide uppercase">Ready to send</p>
                </div>
              )}

              <form onSubmit={handleSendReply} className="flex items-center gap-2 md:gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 md:w-11 md:h-11 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <ImageIcon size={18} className="text-gray-600" />
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a reply..."
                  disabled={isUploading}
                  className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="submit"
                  disabled={isUploading || (!input.trim() && !selectedFile)}
                  className="w-10 h-10 md:w-11 md:h-11 bg-indigo-600 text-white rounded-xl shrink-0 flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md"
                >
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-gray-400 bg-gray-50">
            <div className="text-center p-8">
              <MessageCircle size={64} className="mx-auto mb-4 opacity-10" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Click on a user from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;