// import { useState, useEffect, useRef } from "react";
// import { useUser } from "@clerk/clerk-react"; // Changed from useAuth
// import { useSupabase } from "../components/providers/SupabaseProvider";
// import toast from "react-hot-toast";

// interface Message {
//   id: string;
//   content: string;
//   image_url?: string;
//   is_admin_reply: boolean;
//   created_at: string;
// }

// interface UserChatSummary {
//   user_id: string;
//   user_name: string;
//   user_email: string;
//   last_message: string;
//   last_message_time: string;
//   unread_count: number;
// }

// export const useAdminSupport = () => {
//   const { user } = useUser();
//   const supabase = useSupabase();
//   const [userChats, setUserChats] = useState<UserChatSummary[]>([]);
//   const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loadingChats, setLoadingChats] = useState(true);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const isMountedRef = useRef(true);

//   const fetchUserChats = async () => {
//     if (!supabase || !user || !isMountedRef.current) return;

//     try {
//       const { data: adminCheck } = await supabase
//         .from("users")
//         .select("is_admin")
//         .eq("id", user.id)
//         .single();

//       if (!adminCheck?.is_admin) {
//         toast.error("Admin access required");
//         return;
//       }

//       const { data: allMessages, error } = await supabase
//         .from("support_messages")
//         .select("user_id, content, image_url, is_admin_reply, created_at")
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       if (!isMountedRef.current) return;

//       const userMap = new Map<string, any[]>();
//       allMessages?.forEach((msg: any) => {
//         if (!userMap.has(msg.user_id)) {
//           userMap.set(msg.user_id, []);
//         }
//         userMap.get(msg.user_id)!.push(msg);
//       });

//       const userIds = Array.from(userMap.keys());
      
//       if (userIds.length === 0) {
//         setUserChats([]);
//         setLoadingChats(false);
//         return;
//       }

//       const { data: users } = await supabase
//         .from("users")
//         .select("id, email, first_name, last_name")
//         .in("id", userIds);

//       if (!isMountedRef.current) return;

//       const chats: UserChatSummary[] = [];
//       userMap.forEach((msgs, userId) => {
//         const userInfo = users?.find((u: any) => u.id === userId);
//         const lastMsg = msgs[0];
//         const unreadCount = msgs.filter(
//           (m) => !m.is_admin_reply && !m.read_by_admin_at
//         ).length;

//         chats.push({
//           user_id: userId,
//           user_name: `${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`.trim() || "User",
//           user_email: userInfo?.email || "No email",
//           last_message: lastMsg.image_url ? "📷 Image" : lastMsg.content || "Message",
//           last_message_time: lastMsg.created_at,
//           unread_count: unreadCount,
//         });
//       });

//       // Sort by most recent
//       chats.sort(
//         (a, b) =>
//           new Date(b.last_message_time).getTime() -
//           new Date(a.last_message_time).getTime()
//       );

//       setUserChats(chats);
//     } catch (err) {
//       console.error("Error loading chats:", err);
//       toast.error("Failed to load support chats");
//     } finally {
//       if (isMountedRef.current) setLoadingChats(false);
//     }
//   };

//   const fetchMessages = async (userId: string) => {
//     if (!supabase || !user || !isMountedRef.current) return;

//     setLoadingMessages(true);
//     try {
//       const { data, error } = await supabase
//         .from("support_messages")
//         .select("id, content, image_url, is_admin_reply, created_at")
//         .eq("user_id", userId)
//         .order("created_at", { ascending: true });

//       if (error) throw error;
//       if (!isMountedRef.current) return;

//       setMessages(data || []);
//     } catch (err) {
//       console.error("Error loading messages:", err);
//       toast.error("Failed to load messages");
//     } finally {
//       if (isMountedRef.current) setLoadingMessages(false);
//     }
//   };

//   const sendAdminReply = async (
//     userId: string,
//     content: string,
//     imageUrl: string = ""
//   ) => {
//     if (!supabase || !user) return;

//     try {
//       const { data: newMsg, error } = await supabase
//         .from("support_messages")
//         .insert({
//           user_id: userId,
//           content: content.trim() || null,
//           image_url: imageUrl || null,
//           is_admin_reply: true,
//         })
//         .select()
//         .single();

//       if (error) throw error;

//       if (isMountedRef.current) {
//         setMessages((prev) => [...prev, newMsg]);
//         toast.success("Reply sent!");

//         // Refresh chats list
//         fetchUserChats();
//       }
//     } catch (err) {
//       console.error("Error sending reply:", err);
//       toast.error("Failed to send reply");
//     }
//   };

//   const uploadImage = async (file: File): Promise<string> => {
//     if (!supabase) return "";

//     try {
//       const fileExt = file.name.split(".").pop();
//       const fileName = `admin/${Date.now()}.${fileExt}`;

//       const { error } = await supabase.storage
//         .from("chat_attachments")
//         .upload(fileName, file, { contentType: file.type });

//       if (error) throw error;

//       const { data: urlData } = supabase.storage
//         .from("chat_attachments")
//         .getPublicUrl(fileName);

//       return urlData.publicUrl;
//     } catch (err) {
//       console.error("Upload error:", err);
//       toast.error("Image upload failed");
//       return "";
//     }
//   };

//   useEffect(() => {
//     isMountedRef.current = true;

//     if (supabase && user) {
//       fetchUserChats();

//       // Subscribe to all new messages (for live updates)
//       const channel = supabase
//         .channel("admin_support_all")
//         .on(
//           "postgres_changes",
//           {
//             event: "INSERT",
//             schema: "public",
//             table: "support_messages",
//           },
//           () => {
//             if (isMountedRef.current) {
//               fetchUserChats(); // Refresh the list when any new message arrives
//             }
//           }
//         )
//         .subscribe();

//       return () => {
//         isMountedRef.current = false;
//         supabase.removeChannel(channel);
//       };
//     }
//   }, [supabase, user]);

//   useEffect(() => {
//     if (activeChatUserId && supabase && user) {
//       fetchMessages(activeChatUserId);

//       // Subscribe to messages for this specific user
//       const channel = supabase
//         .channel(`admin_chat:${activeChatUserId}`)
//         .on(
//           "postgres_changes",
//           {
//             event: "INSERT",
//             schema: "public",
//             table: "support_messages",
//             filter: `user_id=eq.${activeChatUserId}`,
//           },
//           (payload: any) => {
//             if (isMountedRef.current) {
//               setMessages((prev) => [...prev, payload.new as Message]);
//             }
//           }
//         )
//         .subscribe();

//       return () => {
//         supabase.removeChannel(channel);
//       };
//     } else {
//       setMessages([]);
//     }
//   }, [activeChatUserId, supabase, user]);

//   return {
//     userChats,
//     activeChatUserId,
//     setActiveChatUserId,
//     messages,
//     loadingChats,
//     loadingMessages,
//     sendAdminReply,
//     uploadImage,
//   };
// };


// hooks/useAdminSupport.ts

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabase } from "../components/providers/SupabaseProvider";
import toast from "react-hot-toast";

interface Message {
  id: string;
  content: string;
  image_url?: string;
  is_admin_reply: boolean;
  created_at: string;
  read_by_admin_at?: string | null;
}

interface UserChatSummary {
  user_id: string;
  user_name: string;
  user_email: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const useAdminSupport = () => {
  const { user } = useUser();
  const supabase = useSupabase();
  const [userChats, setUserChats] = useState<UserChatSummary[]>([]);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const isMountedRef = useRef(true);

  const fetchUserChats = async () => {
    if (!supabase || !user || !isMountedRef.current) return;

    try {
      const { data: adminCheck } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!adminCheck?.is_admin) {
        toast.error("Admin access required");
        return;
      }

      const { data: allMessages, error } = await supabase
        .from("support_messages")
        .select("user_id, content, image_url, is_admin_reply, created_at, read_by_admin_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!isMountedRef.current) return;

      const userMap = new Map<string, any[]>();
      allMessages?.forEach((msg: any) => {
        if (!userMap.has(msg.user_id)) userMap.set(msg.user_id, []);
        userMap.get(msg.user_id)!.push(msg);
      });

      const userIds = Array.from(userMap.keys());
      if (userIds.length === 0) {
        setUserChats([]);
        setLoadingChats(false);
        return;
      }

      const { data: users } = await supabase
        .from("users")
        .select("id, email, first_name, last_name")
        .in("id", userIds);

      if (!isMountedRef.current) return;

      const chats: UserChatSummary[] = [];
      userMap.forEach((msgs, userId) => {
        const userInfo = users?.find((u: any) => u.id === userId);
        const lastMsg = msgs[0];

        // Count only USER messages that haven't been read by admin
        const unreadCount = msgs.filter(
          (m) => !m.is_admin_reply && !m.read_by_admin_at
        ).length;

        chats.push({
          user_id: userId,
          user_name: `${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`.trim() || "User",
          user_email: userInfo?.email || "No email",
          last_message: lastMsg.image_url ? "📷 Image" : lastMsg.content || "Message",
          last_message_time: lastMsg.created_at,
          unread_count: unreadCount,
        });
      });

      chats.sort(
        (a, b) =>
          new Date(b.last_message_time).getTime() -
          new Date(a.last_message_time).getTime()
      );

      setUserChats(chats);
    } catch (err) {
      console.error("Error loading chats:", err);
      toast.error("Failed to load support chats");
    } finally {
      if (isMountedRef.current) setLoadingChats(false);
    }
  };

  const markMessagesAsRead = async (userId: string) => {
    if (!supabase) return;

    await supabase
      .from("support_messages")
      .update({ read_by_admin_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("read_by_admin_at", null)
      .neq("is_admin_reply", true); // Only mark user messages as read
  };

  const fetchMessages = async (userId: string) => {
    if (!supabase || !user || !isMountedRef.current) return;

    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from("support_messages")
        .select("id, content, image_url, is_admin_reply, created_at, read_by_admin_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (!isMountedRef.current) return;

      setMessages(data || []);

      // Mark as read when admin opens the chat
      const hasUnread = data?.some((m: any) => !m.is_admin_reply && !m.read_by_admin_at);
      if (hasUnread) {
        await markMessagesAsRead(userId);
        // Refresh the sidebar unread counts
        fetchUserChats();
      }
    } catch (err) {
      console.error("Error loading messages:", err);
      toast.error("Failed to load messages");
    } finally {
      if (isMountedRef.current) setLoadingMessages(false);
    }
  };

  const sendAdminReply = async (
    userId: string,
    content: string,
    imageUrl: string = ""
  ) => {
    if (!supabase || !user) return;

    try {
      const { data: newMsg, error } = await supabase
        .from("support_messages")
        .insert({
          user_id: userId,
          content: content.trim() || null,
          image_url: imageUrl || null,
          is_admin_reply: true,
        })
        .select()
        .single();

      if (error) throw error;

      if (isMountedRef.current) {
        setMessages((prev) => [...prev, newMsg]);
        toast.success("Reply sent!");
        fetchUserChats(); // Update last message + clear unread if needed
      }
    } catch (err) {
      console.error("Error sending reply:", err);
      toast.error("Failed to send reply");
    }
  };

  // uploadImage remains the same...

  useEffect(() => {
    isMountedRef.current = true;

    if (supabase && user) {
      fetchUserChats();

      const channel = supabase
        .channel("admin_support_all")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "support_messages" },
          () => {
            if (isMountedRef.current) fetchUserChats();
          }
        )
        .subscribe();

      return () => {
        isMountedRef.current = false;
        supabase.removeChannel(channel);
      };
    }
  }, [supabase, user]);

  const uploadImage = async (file: File): Promise<string> => {
    if (!supabase) return "";

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `admin/${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("chat_attachments")
        .upload(fileName, file, { contentType: file.type });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("chat_attachments")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Image upload failed");
      return "";
    }
  };

  useEffect(() => {
    if (activeChatUserId && supabase && user) {
      fetchMessages(activeChatUserId);

      const channel = supabase
        .channel(`admin_chat:${activeChatUserId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "support_messages",
            filter: `user_id=eq.${activeChatUserId}`,
          },
          (payload: any) => {
            if (isMountedRef.current) {
              setMessages((prev) => [...prev, payload.new as Message]);
              // If new message is from user, mark as unread in sidebar
              if (!payload.new.is_admin_reply) {
                fetchUserChats();
              }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setMessages([]);
    }
  }, [activeChatUserId, supabase, user]);

  return {
    userChats,
    activeChatUserId,
    setActiveChatUserId,
    messages,
    loadingChats,
    loadingMessages,
    sendAdminReply,
    uploadImage,
  };
};