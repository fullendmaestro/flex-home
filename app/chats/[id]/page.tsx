"use client";

import { useState, useRef, useEffect } from "react";
import ChatLayout from "../components/ChatLayout";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import EscalateButton from "../components/EscalateButton";
import { useParams } from "next/navigation";
import {
  escalateChat,
  fetchChatById,
  getLoggedInUser,
  sendMessage,
} from "@/lib/actions/user.actions";

const ChatIdPage = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) return;
  const param = useParams<{ id: string }>();
  const id = param.id;
  console.log(id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChat = async () => {
      try {
        const chat = await fetchChatById(id);
        if (chat) {
          setMessages(chat.messages);
          setIsEscalated(chat.isEscalated);
        }
        console.log(messages);
      } catch (error) {
        console.error("Failed to fetch chat:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChat();
  }, [id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsThinking(true);

    try {
      const newMessage = {
        message: input,
        senderId: "user", // This can be the current logged-in user's ID
      };
      const updatedChat = await sendMessage(
        id,
        newMessage.message,
        newMessage.senderId
      );

      if (updatedChat) {
        setMessages(updatedChat.messages);
        setInput("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleOptionSelect = (nextStep: number | "resolve" | "escalate") => {
    // Handle option selection, if needed.
  };

  const handleEscalate = async () => {
    try {
      const updatedChat = await escalateChat(id);
      if (updatedChat) {
        setIsEscalated(true);
      }
    } catch (error) {
      console.error("Error escalating chat:", error);
    }
  };

  if (isLoading) {
    return <p>Loading chat...</p>;
  }

  return (
    // <ChatLayout
    //   chats={chats}
    //   currentChatId={currentChatId}
    //   setCurrentChatId={() => {}}
    //   isSidebarOpen={false}
    //   setIsSidebarOpen={() => {}}
    // >
    <>
      <ChatMessages
        messages={messages}
        isEscalated={isEscalated}
        isThinking={isThinking}
        lastMessageRef={lastMessageRef}
        handleOptionSelect={handleOptionSelect}
      />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isThinking={isThinking}
        isEscalated={isEscalated}
      />
      <EscalateButton
        handleEscalate={handleEscalate}
        isDisabled={isEscalated}
      />
      {/* </ChatLayout> */}
    </>
  );
};

export default ChatIdPage;
