import { getServerSession } from "@/lib/nextauth/session";
import { VercelToolbar } from "@vercel/toolbar/next";

const staffs = ["nrohi"];

export async function StaffToolbar() {
  const session = await getServerSession();
  const isStaff = session?.name ? staffs.includes(session.name) : false;
  return isStaff ? <VercelToolbar /> : null;
}
