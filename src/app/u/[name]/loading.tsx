import { Icons } from "@/components/icons";
import React from "react";

export default function DashboardLoading() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-104px-64px)]">
      <Icons.loader className="size-10 animate-spin" />
    </div>
  );
}
