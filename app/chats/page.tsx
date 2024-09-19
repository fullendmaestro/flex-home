import { useEffect, useState } from "react";
import WelcomeCard from "./components/WelcomeCard";
import ChatLayout from "./components/ChatLayout";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const ChatPage = async () => {
  // let loggedIn = await getLoggedInUser();
  // if (!loggedIn) return <div>please log in</div>;
  return (
    <div className="h-full flex items-center justify-center">
      <WelcomeCard />{" "}
    </div>
  );
};

export default ChatPage;
