"use client";

import { useState, useEffect, useRef, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { handleSendMessage } from "@/lib/actions/user.actions";
import { useParams } from "next/navigation";

type Message = {
  id: number;
  text: string;
  sender: "user" | "agent";
  options?: TroubleshootingOption[];
};

type TroubleshootingOption = {
  text: string;
  nextStep: number | "resolve" | "escalate";
};

const troubleshootingSteps: {
  [key: number]: { text: string; options: TroubleshootingOption[] };
} = {
  1: {
    text: "What issue are you experiencing with your SmartHome Hub?",
    options: [
      { text: "Hub won't connect to Wi-Fi", nextStep: 2 },
      { text: "Hub is unresponsive", nextStep: 3 },
      { text: "Devices not connecting to Hub", nextStep: 4 },
    ],
  },
  // ... (other troubleshooting steps)
};

export default function ChatIdPageCM() {
  const { id } = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const chatContentRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim() === "" || isThinking) return;

    const newMessage: Message = {
      id: messages.length,
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsThinking(true);

    const sendMessage = async () => {
      try {
        const data = await handleSendMessage({
          chatId: id,
          message: input,
        });

        const botResponse: Message = {
          id: messages.length + 1,
          text: data.text,
          sender: "agent",
          options: data.options,
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsThinking(false);
        setCurrentStep(data.nextStep);
      } catch (error) {
        console.error("Error sending message:", error);
        setIsThinking(false);
      }
    };

    sendMessage();
  };

  const handleOptionSelect = (nextStep: number | "resolve" | "escalate") => {};

  useEffect(() => {}, []);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <ScrollArea className="flex-grow p-4" ref={chatContentRef}>
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 100 }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              <div
                className={`flex items-start ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {message.sender === "user" ? "U" : "A"}
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`mx-2 p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {message.text}
                  {message.options && (
                    <RadioGroup className="mt-2 space-y-1">
                      {message.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            id={`option-${message.id}-${index}`}
                            value={option.text}
                            onClick={() => handleOptionSelect(option.nextStep)}
                          />
                          <Label htmlFor={`option-${message.id}-${index}`}>
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 100 }}
              className="flex justify-start mb-4"
            >
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="bg-secondary p-3 rounded-lg"
                >
                  Thinking...
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex space-x-2"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
            disabled={isThinking}
          />
          <Button type="submit" disabled={isThinking}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
