import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../api/auth/[...nextauth]/route"


export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  }

  const { title, type, description, content, tags, published, fileUrl } = await req.json()

  if (!title || !type) {
    return NextResponse.json({ error: "Título e tipo obrigatórios" }, { status: 400 })
  }

  const work = await prisma.work.create({
    data: {
      title,
      type,
      description: description || null,
      content: content || null,
      tags: Array.isArray(tags) ? tags : [],
      published: typeof published === "boolean" ? published : !!published,
      fileUrl: fileUrl || null,
      authorId: user.id,
    },
  })

  return NextResponse.json(work)
}
