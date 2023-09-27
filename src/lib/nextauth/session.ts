import { auth } from ".";

export async function getServerSession() {
    const sess = await auth()
    if (!sess?.user) return null
    return sess.user
}