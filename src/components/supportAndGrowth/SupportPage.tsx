import React, { useState, useRef, useEffect } from "react";
import { Send, ShieldCheck, Image as ImageIcon, Loader2, X } from "lucide-react";
import { useSupportChat } from "../../hooks/useSupportChat";
import Loading from "../Loading";

const SupportPage: React.FC = () => {
  const { messages, loading, hasMore, sendMessage, uploadImage, loadMore } = useSupportChat();
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current || !hasMore || loading) return;
    if (containerRef.current.scrollTop === 0) loadMore();
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    let finalImageUrl = "";

    if (selectedFile) {
      setIsUploading(true);
      const uploadedUrl = await uploadImage(selectedFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
      setIsUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }

    await sendMessage(input, finalImageUrl);
    setInput("");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  if (loading && messages.length === 0) return <Loading />;

  return (
    <div className="flex flex-col h-150 bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b bg-gray-50/50 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Official Support</h3>
          <p className="text-[10px] text-green-500 font-medium">● Online</p>
        </div>
      </div>

      <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {hasMore && <div className="text-center py-2 text-[10px] text-gray-400 font-medium">Scroll up to load older messages</div>}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.is_admin_reply ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.is_admin_reply ? "bg-gray-100 text-gray-800 rounded-tl-none" : "bg-indigo-600 text-white rounded-tr-none"}`}>
              {msg.image_url && (
                <a href={msg.image_url} target="_blank" rel="noreferrer">
                  <img src={msg.image_url} alt="attachment" className="rounded-lg mb-2 max-h-40 object-cover cursor-zoom-in" />
                </a>
              )}
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="relative bg-gray-50 border-t p-4">
        {previewUrl && (
          <div className="absolute -top-20 left-4 p-2 bg-white border border-gray-200 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="relative w-12 h-12">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg border border-gray-100" />
              <button 
                onClick={removeSelectedFile}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
            <div className="pr-2">
              <p className="text-[10px] font-bold text-gray-900 truncate max-w-25">{selectedFile?.name}</p>
              <p className="text-[8px] text-gray-400 uppercase">Ready to send</p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={onFileChange} disabled={isUploading} />
          <label htmlFor="file-upload" className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors">
            <ImageIcon size={18} />
          </label>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isUploading ? "Uploading image..." : "Type your message..."}
            disabled={isUploading}
            className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-2 text-sm focus:outline-none disabled:opacity-50"
          />

          <button type="submit" disabled={isUploading} className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportPage;