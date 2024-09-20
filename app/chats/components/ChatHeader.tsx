import { Button } from "@/components/ui/button";
import { createChat } from "@/lib/actions/user.actions";
import { Menu, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ChatHeaderProps = {
  setIsSidebarOpen: (open: boolean) => void;
  // startNewChat: () => void;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ setIsSidebarOpen }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleStartNewChat = async () => {
    setIsLoading(true);
    try {
      // Create a new chat
      const newChat = await createChat({
        title: "New Chat",
        isEscalated: false,
      });

      if (newChat) {
        // Navigate to the new chat with its unique ID
        router.push(`/chats/${newChat.$id}`);
      } else {
        console.error("Failed to create a new chat");
      }
    } catch (error) {
      console.error("Error starting new chat:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const startNewChat = () => {};
  return (
    <header className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="mr-2"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <h1 className="text-xl font-bold">FlexHome Support</h1>
      </div>
      <Button
        onClick={handleStartNewChat}
        disabled={isLoading}
        variant="ghost"
        size="icon"
      >
        <PlusCircle className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default ChatHeader;
