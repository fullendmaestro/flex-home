import { Button } from "@/components/ui/button";
import { Menu, PlusCircle } from "lucide-react";

type ChatHeaderProps = {
  setIsSidebarOpen: (open: boolean) => void;
  // startNewChat: () => void;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ setIsSidebarOpen }) => {
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
      <Button variant="ghost" size="icon" onClick={startNewChat}>
        <PlusCircle className="h-6 w-6" />
        <span className="sr-only">Start new chat</span>
      </Button>
    </header>
  );
};

export default ChatHeader;
