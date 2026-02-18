import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"


export default async function AuthRedirect() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user?.slug) {
    redirect("/welcome")
  }

  redirect("/dashboard")
}