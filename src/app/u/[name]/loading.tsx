import { Icons } from "@/components/icons";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[calc(100vh-104px-64px)] items-center justify-center">
      <Icons.loader className="size-10 animate-spin" />
    </div>
  );
}
