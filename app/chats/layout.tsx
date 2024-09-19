"use client";

import React, { useState } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatHeader from "./components/ChatHeader";

type ChatLayoutProps = {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
};

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <ChatSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        <ChatHeader setIsSidebarOpen={setIsSidebarOpen} />
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;
