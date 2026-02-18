import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })

  const { id, restore } = await req.json()

  const work = await prisma.work.findFirst({ where: { id, authorId: user.id } })
  if (!work) return NextResponse.json({ error: "Obra não encontrada" }, { status: 404 })

  await prisma.work.update({
    where: { id },
    data: {
      deletedAt: restore ? null : new Date(),
      featuredOrder: restore ? work.featuredOrder : null,
    },
  })

  return NextResponse.json({ ok: true })
}