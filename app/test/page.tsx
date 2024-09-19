"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PlusCircle,
  Menu,
  X,
  Headphones,
  Send,
  MessageSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Message = {
  id: number;
  text: string;
  sender: "user" | "agent" | "human";
  options?: TroubleshootingOption[];
};

type TroubleshootingOption = {
  text: string;
  nextStep: number | "resolve" | "escalate";
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
  isEscalated: boolean;
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
  2: {
    text: "Let's troubleshoot the Wi-Fi connection. Is your router powered on and functioning?",
    options: [
      { text: "Yes, the router is working", nextStep: 5 },
      { text: "No, there seems to be an issue with the router", nextStep: 6 },
      { text: "I'm not sure", nextStep: 7 },
    ],
  },
  3: {
    text: "For an unresponsive hub, let's try a few things. Have you tried restarting the hub?",
    options: [
      { text: "Yes, I've tried restarting", nextStep: 8 },
      { text: "No, I haven't tried that yet", nextStep: 9 },
    ],
  },
  4: {
    text: "If devices aren't connecting to the hub, let's check a few things. Is the hub's status light on and stable?",
    options: [
      { text: "Yes, the status light is on and stable", nextStep: 10 },
      { text: "No, the status light is off or blinking", nextStep: 11 },
    ],
  },
  5: {
    text: "Great. Let's try reconnecting your hub to Wi-Fi. Have you tried forgetting the network and reconnecting?",
    options: [
      { text: "Yes, I've tried that", nextStep: 12 },
      { text: "No, I'll try that now", nextStep: "resolve" },
    ],
  },
  6: {
    text: "I see. Can you try restarting your router? Unplug it for 30 seconds, then plug it back in.",
    options: [
      { text: "Okay, I'll try that", nextStep: "resolve" },
      { text: "I've already tried that, it didn't help", nextStep: "escalate" },
    ],
  },
  7: {
    text: "No problem. Can you locate your router and check if the power light is on?",
    options: [
      { text: "Yes, the power light is on", nextStep: 5 },
      { text: "No, the power light is off", nextStep: 6 },
    ],
  },
  8: {
    text: "If you've already restarted the hub, let's check the power source. Is it properly plugged in and the power outlet working?",
    options: [
      {
        text: "Yes, it's properly plugged in and the outlet works",
        nextStep: "escalate",
      },
      { text: "Let me double-check that", nextStep: "resolve" },
    ],
  },
  9: {
    text: "Okay, let's try restarting the hub. Unplug it, wait for 10 seconds, then plug it back in. Let me know if that helps.",
    options: [
      { text: "Okay, I'll try that now", nextStep: "resolve" },
      { text: "That didn't solve the issue", nextStep: 8 },
    ],
  },
  10: {
    text: "Good. Let's try removing a device from the hub and re-adding it. Can you try that with one of the devices?",
    options: [
      { text: "Yes, I'll try that", nextStep: "resolve" },
      { text: "I've already tried that, it didn't work", nextStep: "escalate" },
    ],
  },
  11: {
    text: "I see. First, let's try restarting the hub. Unplug it, wait for 10 seconds, then plug it back in. Did that help?",
    options: [
      { text: "Yes, the status light is now stable", nextStep: 10 },
      {
        text: "No, the status light is still off or blinking",
        nextStep: "escalate",
      },
    ],
  },
  12: {
    text: "If reconnecting didn't work, let's try resetting the hub to factory settings. Are you comfortable doing this? It will erase all settings.",
    options: [
      { text: "Yes, I'll try resetting the hub", nextStep: "resolve" },
      { text: "I'd rather not reset the hub", nextStep: "escalate" },
    ],
  },
};

export default function TechnicalSupportAgent() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(1);
  const [error, setError] = useState<string | null>(null);

  const chatContentRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const handleSend = () => {
    if (input.trim() === "" || isThinking || !currentChatId) return;

    const updatedChats = chats.map((chat) => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            { id: chat.messages.length, text: input, sender: "user" },
          ],
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setInput("");
    setIsThinking(true);
    setError(null);

    // Simulated bot response
    setTimeout(() => {
      let botResponse: Message;

      if (currentStep !== null && troubleshootingSteps[currentStep]) {
        const stepData = troubleshootingSteps[currentStep];
        botResponse = {
          id: currentChat!.messages.length + 1,
          text: stepData.text,
          sender: "agent",
          options: stepData.options,
        };
        setCurrentStep(currentStep + 1);
      } else {
        botResponse = {
          id: currentChat!.messages.length + 1,
          text: "I understand you're having an issue. Could you please provide more details about the problem you're experiencing?",
          sender: "agent",
          options: troubleshootingSteps[1].options,
        };
        setCurrentStep(1);
      }

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, botResponse] }
            : chat
        )
      );
      setIsThinking(false);
    }, 1000);
  };

  const startNewChat = () => {
    const newChatId = chats.length + 1;
    const initialMessage = {
      id: 0,
      text: "Hello! I'm your SmartHome Hub support agent. How can I assist you today?",
      sender: "agent",
      options: troubleshootingSteps[1].options,
    };

    setChats((prevChats) => [
      ...prevChats,
      {
        id: newChatId,
        title: `New Chat ${newChatId}`,
        messages: [initialMessage],
        isEscalated: false,
      },
    ]);
    setCurrentChatId(newChatId);
    setIsSidebarOpen(false);
    setCurrentStep(1);
    setError(null);
  };

  const escalateToHuman = () => {
    if (!currentChatId) return;

    const updatedChats = chats.map((chat) => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          isEscalated: true,
          messages: [
            ...chat.messages,
            {
              id: chat.messages.length,
              text: "Your chat has been escalated to human support. A representative will be with you shortly.",
              sender: "human",
            },
          ],
        };
      }
      return chat;
    });
    setChats(updatedChats);
    setCurrentStep(null);
  };

  const handleOptionSelect = (nextStep: number | "resolve" | "escalate") => {
    if (!currentChatId) return;

    if (nextStep === "resolve") {
      const updatedChats = chats.map((chat) => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: chat.messages.length,
                text: "Great! I'm glad we could resolve your issue. Is there anything else I can help you with?",
                sender: "agent",
                options: troubleshootingSteps[1].options,
              },
            ],
          };
        }
        return chat;
      });
      setChats(updatedChats);
      setCurrentStep(1);
    } else if (nextStep === "escalate") {
      escalateToHuman();
    } else {
      const nextStepData = troubleshootingSteps[nextStep];
      const updatedChats = chats.map((chat) => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: chat.messages.length,
                text: nextStepData.text,
                sender: "agent",
                options: nextStepData.options,
              },
            ],
          };
        }
        return chat;
      });
      setChats(updatedChats);
      setCurrentStep(nextStep);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages]);

  return (
    <div className="flex h-screen bg-background">
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
                    setCurrentChatId(chat.id);
                    setIsSidebarOpen(false);
                    setCurrentStep(1);
                    setError(null);
                  }}
                >
                  {chat.title}
                  {chat.isEscalated && <Headphones className="ml-2 h-4 w-4" />}
                </Button>
              ))}
            </ScrollArea>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  User Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <header className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-2"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <h1 className="text-xl font-bold">SmartHome Hub Support</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={startNewChat}>
            <PlusCircle className="h-6 w-6" />
            <span className="sr-only">Start new chat</span>
          </Button>
        </header>

        <div className="flex-grow relative overflow-hidden">
          {currentChatId === null ? (
            <div className="h-full flex items-center justify-center">
              <Card className="w-96">
                <CardHeader>
                  <CardTitle>Welcome to SmartHome Hub Support</CardTitle>
                  <CardDescription>
                    Start a new chat to get assistance with your SmartHome Hub
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={startNewChat} className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start New Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <ScrollArea className="h-full p-4" ref={chatContentRef}>
              {currentChat?.isEscalated && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <Alert className="mb-4">
                    <Headphones className="h-4 w-4" />
                    <AlertTitle>Human Support Active</AlertTitle>
                    <AlertDescription>
                      You are now connected to a human support representative.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
              <AnimatePresence initial={false}>
                {currentChat?.messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } mb-4`}
                    ref={
                      index === currentChat.messages.length - 1
                        ? lastMessageRef
                        : null
                    }
                  >
                    <div
                      className={`flex items-start ${
                        message.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {message.sender === "user"
                            ? "U"
                            : message.sender === "human"
                            ? "H"
                            : "A"}
                        </AvatarFallback>
                      </Avatar>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className={`mx-2 p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.sender === "human"
                            ? "bg-green-100 text-green-800"
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
                                  onClick={() =>
                                    handleOptionSelect(option.nextStep)
                                  }
                                />
                                <Label
                                  htmlFor={`option-${message.id}-${index}`}
                                >
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
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {currentChatId !== null && !currentChat?.isEscalated && (
            <div className="fixed bottom-20 right-4 z-50">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg"
                      onClick={escalateToHuman}
                    >
                      <Headphones className="h-6 w-6" />
                      <span className="sr-only">Escalate to Human Support</span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Escalate to Human Support</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {currentChatId !== null && (
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
                disabled={isThinking || currentChat?.isEscalated}
              />
              <Button
                type="submit"
                disabled={isThinking || currentChat?.isEscalated}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
