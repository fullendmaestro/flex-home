import React, { useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";

const chatLayout = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <ChatSidebar
        chats={chats}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        <ChatHeader setIsSidebarOpen={setIsSidebarOpen} />
        {children}
      </div>
    </>
  );
};

export default chatLayout;
