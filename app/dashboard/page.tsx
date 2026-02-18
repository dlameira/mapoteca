import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import EditableMain from "./EditableMain"


function typeIcon(type: string) {
  return type === "PINTURA" ? "🎨"
    : type === "POESIA" ? "✦"
    : type === "CONTO" ? "☽"
    : type === "DESENHO" ? "◈"
    : type === "FOTOGRAFIA" ? "📷"
    : type === "MUSICA" ? "♪"
    : "◇"
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const params = await searchParams
  const isEditing = params.edit === "1"

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      works: { orderBy: { createdAt: "desc" } },
      collections: true,
    },
  })

  if (!user) redirect("/login")

  const worksCount = user.works.length
  const collectionsCount = user.collections.length
  const featuredWorks = user.works
    .filter(w => w.published && !w.hidden)
    .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999))
    .slice(0, 5)
  const firstName = user.name?.split(" ")[0] || "Artista"
  const lastName = user.name?.split(" ").slice(1).join(" ") || ""
  const initial = user.name?.[0]?.toUpperCase() || "?"
  const createdYear = new Date(user.createdAt).getFullYear()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        .mapoteca * { box-sizing: border-box; margin: 0; padding: 0; }
        .mapoteca { font-family: 'DM Mono', monospace; font-size: 12px; background: #F5F0EC; color: #0D0D0D; min-height: 100vh; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        .topbar { border-bottom: 1px solid #0D0D0D; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 48px; position: sticky; top: 0; background: #F5F0EC; z-index: 100; }
        .topbar-edit { border-bottom: 1px solid #0D0D0D; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 48px; position: sticky; top: 0; background: #0D0D0D; z-index: 100; }
        .layout { display: grid; grid-template-columns: 280px 1fr; min-height: calc(100vh - 48px); }
        .sidebar { border-right: 1px solid #0D0D0D; padding: 48px 32px; display: flex; flex-direction: column; gap: 40px; position: sticky; top: 48px; height: calc(100vh - 48px); overflow-y: auto; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #0D0D0D; border: 1px solid #0D0D0D; }
        .stat-cell { background: #F5F0EC; padding: 14px 12px; }
        .nav-item { border-top: 1px solid #D6CFC8; display: flex; align-items: center; justify-content: space-between; padding: 12px 0; cursor: pointer; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #8A8480; transition: all 0.15s; }
        .nav-item:last-child { border-bottom: 1px solid #D6CFC8; }
        .nav-item:hover { color: #0D0D0D; padding-left: 6px; }
        .nav-item.active { color: #0D0D0D; }
        .count { background: #FAD9E2; color: #0D0D0D; padding: 2px 6px; font-size: 9px; }
        .nav-item.active .count { background: #F2A7B8; }
        .main { padding: 48px; display: flex; flex-direction: column; gap: 48px; }
        .section-header { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px solid #0D0D0D; padding-bottom: 12px; margin-bottom: 24px; }
        .featured-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: #0D0D0D; border: 1px solid #0D0D0D; }
        .featured-item { position: relative; overflow: hidden; cursor: pointer; min-height: 160px; display: flex; align-items: center; justify-content: center; }
        .featured-item:first-child { grid-row: span 2; }
        .feat-inner { width: 100%; height: 100%; min-height: 160px; display: flex; align-items: center; justify-content: center; font-size: 48px; transition: transform 0.4s; }
        .featured-item:hover .feat-inner { transform: scale(1.05); }
        .feat-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; background: linear-gradient(transparent, rgba(13,13,13,0.75)); color: #F5F0EC; opacity: 0; transition: opacity 0.3s; }
        .featured-item:hover .feat-overlay { opacity: 1; }
        .feat-tag { position: absolute; top: 12px; left: 12px; background: #F2A7B8; color: #0D0D0D; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 8px; }
        .works-list { display: flex; flex-direction: column; }
        .work-row { display: grid; grid-template-columns: 40px 1fr 120px 80px 24px; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid #D6CFC8; cursor: pointer; transition: all 0.15s; }
        .work-row:first-child { border-top: 1px solid #D6CFC8; }
        .work-row:hover { background: #E8E3DE; margin: 0 -16px; padding: 14px 16px; }
        .work-thumb { width: 36px; height: 36px; border: 1px solid #D6CFC8; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; overflow: hidden; }
        .work-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .type-badge { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 7px; border: 1px solid currentColor; }
        .type-PINTURA { color: #8B7355; }
        .type-POESIA { color: #F2A7B8; }
        .type-CONTO { color: #5A7A6B; }
        .type-DESENHO { color: #6B6B8B; }
        .type-FOTOGRAFIA { color: #7A6B5A; }
        .type-MUSICA { color: #5A6B7A; }
        .type-OUTRO { color: #8A8480; }
        .collections-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #D6CFC8; border: 1px solid #D6CFC8; }
        .collection-card { background: #F5F0EC; padding: 24px; display: flex; flex-direction: column; gap: 12px; cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; }
        .collection-card:hover { background: #E8E3DE; border-left-color: #F2A7B8; }
        .coll-bar { height: 2px; background: #D6CFC8; position: relative; overflow: hidden; }
        .coll-bar-fill { position: absolute; top: 0; left: 0; bottom: 0; background: #F2A7B8; }
        .btn-ghost { background: none; border: 1px solid #0D0D0D; padding: 6px 16px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; text-decoration: none; color: #0D0D0D; display: inline-block; }
        .btn-ghost:hover { background: #0D0D0D; color: #F5F0EC; }
        .btn-pink { background: none; border: none; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; color: #F2A7B8; }
        .pink-dot { display: inline-block; width: 6px; height: 6px; background: #F2A7B8; border-radius: 50%; margin-right: 6px; }
        .avatar-box { width: 80px; height: 80px; border: 1px solid #0D0D0D; background: #FAD9E2; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 300; }
        .empty-state { padding: 64px 32px; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; border: 1px dashed #D6CFC8; }
        .empty-icon { font-size: 32px; }
        .empty-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; }
        .empty-desc { font-size: 11px; color: #8A8480; line-height: 1.7; max-width: 300px; }
        .btn-primary { background: #0D0D0D; color: #F5F0EC; border: none; padding: 10px 24px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; text-decoration: none; display: inline-block; transition: background 0.2s; }
        .btn-primary:hover { background: #F2A7B8; color: #0D0D0D; }
        .feat-media { width: 100%; height: 100%; min-height: 160px; display: block; }
        .feat-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .feat-fallback { width: 100%; height: 100%; min-height: 160px; display: flex; align-items: center; justify-content: center; }
      `}</style>

      <div className="mapoteca">

        {/* TOPBAR — muda visual no modo edição */}
        {isEditing ? (
          <header className="topbar-edit">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ display: "inline-block", width: 6, height: 6, background: "#F2A7B8", borderRadius: "50%" }} />
              <div className="serif" style={{ fontSize: 18, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F5F0EC" }}>
                Mapoteca
              </div>
              <span style={{ fontSize: 10, color: "#8A8480", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                · Modo edição
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="/dashboard" style={{ color: "#8A8480", textDecoration: "none", padding: "6px 16px", border: "1px solid #333", fontFamily: "DM Mono, monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Cancelar
              </a>
            </div>
          </header>
        ) : (
          <header className="topbar">
            <div className="serif" style={{ fontSize: 18, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Mapoteca
            </div>
            <nav style={{ display: "flex", gap: 32, color: "#8A8480", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 10 }}>
              <a href="#" style={{ color: "#8A8480", textDecoration: "none" }}>Explorar</a>
              <a href="#" style={{ color: "#8A8480", textDecoration: "none" }}>Artistas</a>
              <a href="#" style={{ color: "#8A8480", textDecoration: "none" }}>Coleções</a>
            </nav>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="/dashboard?edit=1" className="btn-ghost" style={{ fontSize: 10 }}>✏ Editar</a>
              <a href="/dashboard/obras/nova" className="btn-ghost">+ Nova Obra</a>
            </div>
          </header>
        )}

        <div className="layout">
          <aside className="sidebar">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#8A8480", textTransform: "uppercase", borderTop: "1px solid #D6CFC8", paddingTop: 12 }}>
                Artista
              </div>
              <div className="avatar-box serif">{initial}</div>
              <div>
                <div className="serif" style={{ fontSize: 28, fontWeight: 300, lineHeight: 1.1 }}>
                  {firstName}{lastName ? <><br />{lastName}</> : ""}
                </div>
                <div style={{ marginTop: 6, fontSize: 10, color: "#F2A7B8", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  @{user.slug || "seuperfil"}
                </div>
              </div>
              <div style={{ fontSize: 11, lineHeight: 1.7, color: "#8A8480", fontWeight: 300 }}>
                {user.bio || "Adicione uma bio no seu perfil."}
              </div>
              <a href="/dashboard/perfil" style={{ fontSize: 10, color: "#8A8480", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", borderBottom: "1px solid #D6CFC8", paddingBottom: 8 }}>
                Editar perfil →
              </a>
            </div>

            <div className="stats-grid">
              {[
                { n: String(worksCount), l: "Obras" },
                { n: String(collectionsCount), l: "Coleções" },
                { n: String(createdYear), l: "Desde" },
                { n: String(featuredWorks.length), l: "Destaques", pink: true },
              ].map((s) => (
                <div key={s.l} className="stat-cell" style={s.pink ? { background: "#FAD9E2" } : {}}>
                  <div className="serif" style={{ fontSize: 24, fontWeight: 300, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8A8480", marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <ul style={{ listStyle: "none" }}>
              {[
                { label: "Todas as obras", count: worksCount, active: true },
                { label: "Pinturas", count: user.works.filter((w) => w.type === "PINTURA").length },
                { label: "Poesia", count: user.works.filter((w) => w.type === "POESIA").length },
                { label: "Desenhos", count: user.works.filter((w) => w.type === "DESENHO").length },
                { label: "Contos", count: user.works.filter((w) => w.type === "CONTO").length },
              ].map((n) => (
                <li key={n.label} className={`nav-item ${n.active ? "active" : ""}`}>
                  {n.label}
                  <span className="count">{n.count}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* MAIN — normal ou modo edição */}
          {isEditing ? (
            <EditableMain works={user.works.map(w => ({
              ...w,
              createdAt: w.createdAt.toISOString(),
              updatedAt: w.updatedAt.toISOString(),
            }))} />
          ) : (
            <main className="main">

              {/* OBRAS EM DESTAQUE */}
              <section>
                <div className="section-header">
                  <div className="serif" style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase" }}>Obras em Destaque</div>
                  <button className="btn-pink">Ver todas →</button>
                </div>

                {worksCount === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">✦</div>
                    <div className="empty-title serif">Nenhuma obra ainda</div>
                    <div className="empty-desc">Adicione sua primeira obra ao catálogo e ela aparecerá aqui em destaque.</div>
                    <a href="/dashboard/obras/nova" className="btn-primary">+ Adicionar primeira obra</a>
                  </div>
                ) : (
                  <div className="featured-grid">
                    {featuredWorks.map((w, i) => (
                      <div
                        key={w.id}
                        className="featured-item"
                        style={{ background: ["#E8DDD5", "#FAD9E2", "#D5E0D8", "#E0D5E8", "#D5DDE0"][i % 5] }}
                      >
                        {w.fileUrl ? (
                          <div className="feat-media">
                            <img src={w.fileUrl} alt={w.title} />
                          </div>
                        ) : (
                          <div className="feat-fallback feat-inner" style={{ fontSize: i === 0 ? 72 : 48 }}>
                            {typeIcon(w.type)}
                          </div>
                        )}
                        {i === 0 && <div className="feat-tag">Recente</div>}
                        <div className="feat-overlay">
                          <div className="serif" style={{ fontSize: 16, fontWeight: 300 }}>{w.title}</div>
                          <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F2A7B8", marginTop: 2 }}>
                            {w.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* CATÁLOGO */}
              <section>
                <div className="section-header">
                  <div className="serif" style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase" }}>Catálogo Completo</div>
                  <button className="btn-pink">Filtrar</button>
                </div>

                {worksCount === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">◈</div>
                    <div className="empty-title serif">Catálogo vazio</div>
                    <div className="empty-desc">Suas obras ocultas continuam no catálogo, mas não aparecem aqui.</div>
                    <a href="/dashboard/obras/nova" className="btn-primary">+ Adicionar nova obra</a>
                  </div>
                ) : (
                  <div className="works-list">
                    {user.works.map((w, i) => (
                      <div key={w.id} className="work-row">
                        <div className="serif" style={{ fontSize: 16, fontWeight: 300, color: "#8A8480", textAlign: "right" }}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className="work-thumb" style={{ background: ["#E8DDD5", "#FAD9E2", "#D5DDE0", "#E0D5E8", "#D5E0D8"][i % 5] }}>
                            {w.fileUrl ? <img src={w.fileUrl} alt={w.title} /> : typeIcon(w.type)}
                          </div>
                          <div>
                            <div className="serif" style={{ fontSize: 16 }}>{w.title}</div>
                            <div style={{ fontSize: 10, color: "#8A8480", marginTop: 2 }}>{w.description || w.type}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span className={`type-badge type-${w.type}`}>{w.type}</span>
                        </div>
                        <div style={{ fontSize: 10, color: "#8A8480", textAlign: "right" }}>
                          {new Date(w.createdAt).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                        </div>
                        <div style={{ color: "#8A8480", textAlign: "center" }}>›</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* COLEÇÕES */}
              <section>
                <div className="section-header">
                  <div className="serif" style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase" }}>Coleções</div>
                  <button className="btn-pink">+ Nova coleção</button>
                </div>

                {collectionsCount === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🌊</div>
                    <div className="empty-title serif">Nenhuma coleção</div>
                    <div className="empty-desc">Organize suas obras em coleções e séries. Agrupe por tema, período ou técnica.</div>
                  </div>
                ) : (
                  <div className="collections-grid">
                    {user.collections.map((c) => (
                      <div key={c.id} className="collection-card">
                        <div style={{ fontSize: 24 }}>🌊</div>
                        <div className="serif" style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.2 }}>{c.name}</div>
                        <div style={{ fontSize: 10, color: "#8A8480", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {c.description || "Sem descrição"}
                        </div>
                        <div className="coll-bar">
                          <div className="coll-bar-fill" style={{ width: "30%" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </main>
          )}
        </div>

        <footer style={{ borderTop: "1px solid #0D0D0D", padding: "16px 40px", display: "flex", justifyContent: "space-between", fontSize: 10, color: "#8A8480", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <span><span className="pink-dot" />Mapoteca · Catálogo de obras</span>
          <span>{user.name} · {user.slug ? `@${user.slug}` : "perfil não configurado"}</span>
        </footer>
      </div>
    </>
  )
}