import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from './Message';
import { AnimatePresence } from 'framer-motion';
import { Alert } from "@/components/ui/alert";

type ChatMessagesProps = {
  messages: Message[];
  isEscalated: boolean;
  isThinking: boolean;
  lastMessageRef: React.RefObject<HTMLDivElement>;
  handleOptionSelect: (nextStep: number | 'resolve' | 'escalate') => void;
};

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isEscalated, isThinking, lastMessageRef, handleOptionSelect }) => (
  <ScrollArea className="h-full p-4">
    {isEscalated && (
      <Alert className="mb-4">
        {/* Human support alert */}
      </Alert>
    )}
    <AnimatePresence initial={false}>
      {messages.map((message, index) => (
        <Message
          key={message.id}
          message={message}
          handleOptionSelect={handleOptionSelect}
          ref={index === messages.length - 1 ? lastMessageRef : null}
        />
      ))}
    </AnimatePresence>
    {isThinking && (
      "Thinking indicator"
    )}
  </ScrollArea>
);

export default ChatMessages;
