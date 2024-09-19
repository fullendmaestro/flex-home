import React from "react";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";

type ChatLayoutProps = {
  children: React.ReactNode;
  chats: Chat[];
  currentChatId: number | null;
  setCurrentChatId: (id: number) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
};

const ChatLayout: React.FC<ChatLayoutProps> = () => (
  <div className="flex h-screen bg-background">
    <ChatSidebar
      chats={chats}
      currentChatId={currentChatId}
      setCurrentChatId={setCurrentChatId}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    >
      <Profile />
    </ChatSidebar>
    <div className="flex-1 flex flex-col">
      <ChatHeader setIsSidebarOpen={setIsSidebarOpen} />
      {children}
    </div>
  </div>
);

export default ChatLayout;
