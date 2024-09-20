import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  fetchUserName,
  getLoggedInUser,
  logoutAccount,
} from "@/lib/actions/user.actions";
import { User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAccount();
      router.push("/sign-in"); // Redirect to sign-in page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // const [userName, setUserName] = useState("User Profile");

  // useEffect(() => {
  //   const getUserId = async () => {
  //     let loggedIn = await getLoggedInUser();
  //     const userId = loggedIn.id;
  //   };

  //   getUserId();

  //   const getUserName = async () => {
  //     try {
  //       const name = await fetchUserName(userId);
  //       setUserName(name);
  //     } catch (error) {
  //       console.error("Error fetching user name:", error);
  //     }
  //   };

  //   getUserName();
  // }, []);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            <User className="mr-2 h-4 w-4" />
            {`User Profile`}
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
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
