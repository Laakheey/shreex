import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabase } from "../components/providers/SupabaseProvider";
import toast from "react-hot-toast";

export function useSupportChat() {
  const { user } = useUser();
  const supabase = useSupabase();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const isMountedRef = useRef(true);
  const PAGE_SIZE = 40;

  const fetchMessages = useCallback(
    async (beforeTimestamp?: string) => {
      if (!user || !supabase || !isMountedRef.current) return;

      try {
        let query = supabase
          .from("support_messages")
          .select("id, content, image_url, is_admin_reply, created_at")
          .eq("user_id", user.id) // Simple eq works fine
          .order("created_at", { ascending: false })
          .limit(PAGE_SIZE + 1);

        if (beforeTimestamp) {
          query = query.lt("created_at", beforeTimestamp);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Supabase fetch error:", error);
          toast.error("Failed to load chat history");
          return;
        }

        if (!isMountedRef.current) return;

        if (data && data.length > 0) {
          const hasMoreData = data.length > PAGE_SIZE;
          const sliced = hasMoreData ? data.slice(0, PAGE_SIZE) : data;
          const reversed = [...sliced].reverse();

          setMessages((prev) =>
            beforeTimestamp ? [...reversed, ...prev] : reversed
          );
          setHasMore(hasMoreData);
        } else {
          if (!beforeTimestamp) setMessages([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    },
    [user, supabase]
  );

  useEffect(() => {
    isMountedRef.current = true;

    if (!user || !supabase) return;

    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel(`support_chat:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          if (!isMountedRef.current) return;
          const newMsg = payload.new;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      isMountedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [user, supabase, fetchMessages]);

  const loadMore = useCallback(() => {
    if (messages.length > 0 && hasMore && !loading) {
      fetchMessages(messages[0].created_at);
    }
  }, [messages, hasMore, loading, fetchMessages]);

  const sendMessage = async (content: string, imageUrl?: string) => {
    if (!user || !supabase || (!content.trim() && !imageUrl)) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      content: content.trim() || "",
      image_url: imageUrl || null,
      is_admin_reply: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);

    const { data, error } = await supabase
      .from("support_messages")
      .insert({
        user_id: user.id,
        content: content.trim() || null,
        image_url: imageUrl || null,
        is_admin_reply: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Send error:", error);
      toast.error("Failed to send message");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      return;
    }

    setMessages((prev) => prev.map((m) => (m.id === tempId ? data : m)));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user || !supabase) return null;

    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${user.id}/support/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("chat_attachments")
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("chat_attachments")
        .getPublicUrl(fileName);

      toast.success("Image uploaded!");
      return urlData.publicUrl;
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed");
      return null;
    }
  };

  return {
    messages,
    loading,
    hasMore,
    sendMessage,
    uploadImage,
    loadMore,
  };
}