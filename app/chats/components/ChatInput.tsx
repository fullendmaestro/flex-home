import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isThinking: boolean;
  isEscalated: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSend, isThinking, isEscalated }) => (
  <div className="p-4 border-t">
    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex space-x-2">
      <Input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-grow"
        disabled={isThinking || isEscalated}
      />
      <Button type="submit" disabled={isThinking || isEscalated}>
        <Send className="h-4 w-4 mr-2" />
        Send
      </Button>
    </form>
  </div>
);

export default ChatInput;
