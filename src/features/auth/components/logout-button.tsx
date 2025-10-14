"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "../config/client";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  async function handleSignOut() {
    const res = await authClient.signOut();
    window.location.reload();
    return res;
  }

  return (
    <Button onClick={handleSignOut} className="w-full">
      <LogOut />
      <span>Logout</span>
    </Button>
  );
}
