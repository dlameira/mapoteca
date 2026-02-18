import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"


export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { name, slug, bio } = await req.json()

  if (!name || !slug) {
    return NextResponse.json({ error: "Nome e slug obrigatórios" }, { status: 400 })
  }

  const slugLimpo = slug.toLowerCase().replace(/[^a-z0-9]/g, "")

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { name, slug: slugLimpo, bio },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Slug já em uso" }, { status: 400 })
  }
}