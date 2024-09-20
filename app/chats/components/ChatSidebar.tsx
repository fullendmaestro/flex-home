import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Headphones, LogOut, Settings, User, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation";
import { fetchChatsList } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";

import Profile from "./Profile";
import Link from "next/link";

type ChatSidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
};

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const param = useParams<{ id: string }>();
  const id = param.id;
  let currentChatId = id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchChatsList();
        setChats(res); // Store fetched data in state
        console.log("Chats fetched successfully:", res);
      } catch (error) {
        console.error("Error fetching chats:", error); // Log any errors
      }
    };

    fetchData();
  }, []);

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-secondary p-4 shadow-lg flex flex-col"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
          <h2 className="text-xl font-bold mb-4">Past Chats</h2>
          <ScrollArea className="flex-grow mb-4">
            {chats.map((chat) => (
              <Button
                key={chat.id}
                variant={chat.id === currentChatId ? "secondary" : "ghost"}
                className="w-full justify-start mb-2"
                onClick={() => {
                  setIsSidebarOpen(false);
                }}
              >
                <Link href={chat.$id}>
                  {chat.title}
                  {chat.isEscalated && <Headphones className="ml-2 h-4 w-4" />}
                </Link>
              </Button>
            ))}
          </ScrollArea>
          <Profile />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatSidebar;
