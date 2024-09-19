"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  MessageCircle,
  Send,
  HeadphonesIcon,
  X,
  Loader2,
  LogIn,
  UserPlus,
  Menu,
} from "lucide-react";
import Link from "next/link";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot" | "human";
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
    text: "What issue are you experiencing with your smart home device?",
    options: [
      { text: "Device won't connect to Wi-Fi", nextStep: 2 },
      { text: "Device is unresponsive", nextStep: 3 },
      { text: "Device is not showing in the app", nextStep: 4 },
    ],
  },
  2: {
    text: "Let's troubleshoot the Wi-Fi connection. What's the status of your router?",
    options: [
      { text: "Router is on and working", nextStep: 5 },
      { text: "Router is off or blinking", nextStep: 6 },
      { text: "I'm not sure", nextStep: 7 },
    ],
  },
  3: {
    text: "For an unresponsive device, let's try a few things:",
    options: [
      { text: "I've tried turning it off and on", nextStep: 8 },
      { text: "I haven't tried that yet", nextStep: 9 },
    ],
  },
  4: {
    text: "If the device isn't showing in the app, let's check a few things:",
    options: [
      { text: "I've updated the app recently", nextStep: 10 },
      { text: "I haven't updated the app", nextStep: 11 },
    ],
  },
  5: {
    text: "Great, let's try reconnecting your device to Wi-Fi. Have you tried forgetting the network and reconnecting?",
    options: [
      { text: "Yes, I've tried that", nextStep: 12 },
      { text: "No, I'll try that now", nextStep: "resolve" },
    ],
  },
  6: {
    text: "Please try restarting your router. Unplug it for 30 seconds, then plug it back in. Did this resolve the issue?",
    options: [
      { text: "Yes, it's working now", nextStep: "resolve" },
      { text: "No, still not working", nextStep: "escalate" },
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
    text: "If you've already tried turning it off and on, let's check the device's power source. Is it properly plugged in?",
    options: [
      { text: "Yes, it's properly plugged in", nextStep: "escalate" },
      { text: "No, let me check that", nextStep: "resolve" },
    ],
  },
  9: {
    text: "Please try turning the device off, wait for 10 seconds, then turn it back on. Did this resolve the issue?",
    options: [
      { text: "Yes, it's working now", nextStep: "resolve" },
      { text: "No, still not working", nextStep: 8 },
    ],
  },
  10: {
    text: "If you've updated the app and the device still isn't showing, let's try refreshing the device list. Go to settings and select 'Refresh Devices'. Did this help?",
    options: [
      { text: "Yes, I can see the device now", nextStep: "resolve" },
      { text: "No, the device is still missing", nextStep: "escalate" },
    ],
  },
  11: {
    text: "Please update your app to the latest version from the app store. After updating, check if the device appears. Did this resolve the issue?",
    options: [
      { text: "Yes, I can see the device now", nextStep: "resolve" },
      { text: "No, the device is still missing", nextStep: 10 },
    ],
  },
  12: {
    text: "If you've already tried reconnecting, let's check if the device is within range of your Wi-Fi. Can you move the device closer to the router?",
    options: [
      { text: "Yes, I'll try that", nextStep: "resolve" },
      { text: "No, it's already close to the router", nextStep: "escalate" },
    ],
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isEscalated, setIsEscalated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (input.trim() === "" || isLoading) return;
    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };
    setMessages([...messages, newMessage]);
    setInput("");
    setIsLoading(true);

    // Start the troubleshooting process
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: troubleshootingSteps[1].text,
        sender: "bot",
        options: troubleshootingSteps[1].options,
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      setCurrentStep(1);
      setIsLoading(false);
    }, 1000);
  };

  const handleOptionSelect = (nextStep: number | "resolve" | "escalate") => {
    if (nextStep === "resolve") {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: "Great! I'm glad we could resolve your issue. Is there anything else I can help you with?",
          sender: "bot",
        },
      ]);
      setCurrentStep(null);
    } else if (nextStep === "escalate") {
      handleEscalate();
    } else {
      const nextStepData = troubleshootingSteps[nextStep];
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: nextStepData.text,
          sender: "bot",
          options: nextStepData.options,
        },
      ]);
      setCurrentStep(nextStep);
    }
  };

  const handleEscalate = () => {
    setIsEscalated(true);
    const escalationMessage: Message = {
      id: messages.length + 1,
      text: "I understand this issue requires more specialized assistance. I'm connecting you with a human representative who will be able to help you further. Please wait a moment while I transfer your chat.",
      sender: "human",
    };
    setMessages((prevMessages) => [...prevMessages, escalationMessage]);
    setCurrentStep(null);
  };

  useEffect(() => {
    if (isChatOpen) {
      const chatInput = document.getElementById("chat-input");
      if (chatInput) chatInput.focus();
    }
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [isChatOpen, messages]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4 md:py-6 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold"><Link href="/home">Flex Home</Link></h1>
          <nav className="hidden md:flex items-center space-x-4">
            <ul className="flex space-x-4">
              <li>
                <a href="#features" className="hover:underline">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:underline">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:underline">
                  Pricing
                </a>
              </li>
            </ul>
            <Link href="/chats">
              <Button variant="secondary" size="sm">
              <MessageCircle className="w-4 h-4 mr-0.3" />
                ChatBot
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </Link>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="hover:underline">
                  Features
                </a>
                <a href="#how-it-works" className="hover:underline">
                  How It Works
                </a>
                <a href="#pricing" className="hover:underline">
                  Pricing
                </a>
                <Link href="/chats">
              <Button variant="secondary" className="w-full justify-start">
              <MessageCircle className="w-4 h-4 mr-0.3" />
                BotChat
              </Button>
            </Link>
                <Link href="/login">
                  <Button variant="ghost" className="w-full justify-start">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="secondary" className="w-full justify-start">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {children}

      <footer className="bg-primary text-primary-foreground py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Flex Home. All rights reserved. </p>
          <p><Link href="/privacy">Privacy</Link> | <Link href="/terms">Terms</Link></p>
        </div>
      </footer>

      {/* Chat UI */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 md:inset-auto md:bottom-20 md:right-4 w-full md:w-96 h-full md:h-[32rem] bg-background border rounded-none md:rounded-lg shadow-lg overflow-hidden flex flex-col z-50"
          >
            <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
              <h3 className="font-semibold">Chat with Us</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close chat</span>
              </Button>
            </div>
            <ScrollArea className="flex-grow p-4 relative" ref={chatContentRef}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
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
                          : "B"}
                      </AvatarFallback>
                    </Avatar>
                    <div
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
                              <Label htmlFor={`option-${message.id}-${index}`}>
                                {option.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start mb-4"
                >
                  <div className="flex items-start">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <div className="mx-2 p-3 rounded-lg bg-secondary">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                </motion.div>
              )}
            </ScrollArea>
            <div className="p-3 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center"
              >
                <Input
                  id="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow mr-2"
                  disabled={isLoading || currentStep !== null}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || currentStep !== null}
                >
                  <Send className="w-4 h-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </div>
            {!isEscalated && currentStep === null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-16 right-3"
              >
                <Button
                  onClick={handleEscalate}
                  variant="outline"
                  size="sm"
                  className="rounded-full shadow-md"
                >
                  <HeadphonesIcon className="w-4 h-4 mr-2" />
                  Speak to a Human
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Icon */}
      <motion.button
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="sr-only">Toggle chat</span>
      </motion.button>
    </div>
  );
}
