import { getServerSession } from '@/lib/nextauth/session';
import { VercelToolbar } from '@vercel/toolbar/next';
 
export async function StaffToolbar() {
  const session = await getServerSession()
  const isStaff = !!session;
  return isStaff ? <VercelToolbar /> : null;
}