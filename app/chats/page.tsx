import WelcomeCard from "./components/WelcomeCard";

import { getLoggedInUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatPage = async () => {
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
    <div className="h-full flex items-center justify-center">
      <WelcomeCard />{" "}
    </div>
  );
};

export default ChatPage;
