"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { createChat } from "@/lib/actions/user.actions";

// import { useRouter } from "next/navigation";

const WelcomeCard = () => {
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
    }
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
          <Button
            onClick={handleStartNewChat}
            className="w-full"
            disabled={isLoading}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Start New Chat
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default WelcomeCard;
