import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"


export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })

  const updates: {
    id: string
    hidden: boolean
    featuredOrder: number | null
    featuredPosition: string | null
    featuredScale: number | null
  }[] = await req.json()

  await Promise.all(
    updates.map(u =>
      prisma.work.update({
        where: { id: u.id },
        data: {
          hidden: u.hidden,
          featuredOrder: u.featuredOrder,
          featuredPosition: u.featuredPosition,
          featuredScale: u.featuredScale,
        },
      })
    )
  )

  return NextResponse.json({ ok: true })
}