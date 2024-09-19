"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
// import { useRouter } from "next/navigation";

const WelcomeCard = () => {
  // const router = useRouter();
  const startNewChat = () => {
    // Navigate to a new chat with a unique ID
    // const newChatId = Date.now(); // Example unique ID
    // router.push(`/chats/${newChatId}`);
  };
  return (
    <>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Welcome to FlexHome Support</CardTitle>
          <CardDescription>
            Start a new chat to get assistance with your FlexHome Devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={startNewChat} className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            Start New Chat
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default WelcomeCard;
