import { fetchChatById, getLoggedInUser } from "@/lib/actions/user.actions";
import ChatIdPageCM from "./ChatIdPageCM";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useEffect } from "react";

const ChatIdPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  let loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Unauthenticated user</CardTitle>
            <CardDescription>
              Seems you have not login your account on this device, please login
              first
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/sign-in`} className="w-full">
              <Button className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>{" "}
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ChatIdPageCM />
    </>
  );
};

export default ChatIdPage;
