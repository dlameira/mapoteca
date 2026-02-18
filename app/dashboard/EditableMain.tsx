"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

type Work = {
  id: string
  title: string
  type: string
  fileUrl: string | null
  hidden: boolean
  featuredOrder: number | null
  featuredPosition: string | null
  featuredScale: number | null
  description: string | null
  content: string | null
  tags: string[]
  published: boolean
  authorId: string
  collectionId: string | null
  createdAt: string
  updatedAt: string
}

function typeIcon(type: string) {
  return type === "PINTURA" ? "🎨"
    : type === "POESIA" ? "✦"
    : type === "CONTO" ? "☽"
    : type === "DESENHO" ? "◈"
    : type === "FOTOGRAFIA" ? "📷"
    : type === "MUSICA" ? "♪"
    : "◇"
}

const BG = ["#E8DDD5", "#FAD9E2", "#D5E0D8", "#E0D5E8", "#D5DDE0"]

export default function EditableMain({ works: initial }: { works: Work[] }) {
  const router = useRouter()
  const [works, setWorks] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [editingCrop, setEditingCrop] = useState<string | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null)
  const dragWorkId = useRef<string | null>(null)

  // obras ordenadas por featuredOrder
  const featured: (Work | null)[] = Array.from({ length: 5 }, (_, i) => {
    return works.find(w => w.featuredOrder === i && !w.hidden) ?? null
  })

  const notFeatured = works.filter(w => w.featuredOrder === null && !w.hidden)
  const hiddenWorks = works.filter(w => w.hidden)

  function setFeaturedSlot(workId: string, slot: number) {
    setWorks(prev => prev.map(w => {
      if (w.id === workId) return { ...w, featuredOrder: slot }
      if (w.featuredOrder === slot) return { ...w, featuredOrder: null }
      return w
    }))
  }

  function removeFromFeatured(workId: string) {
    setWorks(prev => prev.map(w =>
      w.id === workId ? { ...w, featuredOrder: null } : w
    ))
  }

  function toggleHidden(id: string) {
    setWorks(prev => prev.map(w => {
      if (w.id !== id) return w
      const nowHidden = !w.hidden
      return { ...w, hidden: nowHidden, featuredOrder: nowHidden ? null : w.featuredOrder }
    }))
  }

  function updateCrop(id: string, position: string, scale: number) {
    setWorks(prev => prev.map(w =>
      w.id === id ? { ...w, featuredPosition: position, featuredScale: scale } : w
    ))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/obras/ordem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(works.map(w => ({
          id: w.id,
          hidden: w.hidden,
          featuredOrder: w.featuredOrder,
          featuredPosition: w.featuredPosition,
          featuredScale: w.featuredScale,
        }))),
      })
      if (res.ok) {
        router.push("/dashboard")
        router.refresh()
      } else {
        alert("Erro ao salvar.")
      }
    } finally {
      setSaving(false)
    }
  }

  const cropWork = editingCrop ? works.find(w => w.id === editingCrop) : null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        .em * { box-sizing: border-box; }
        .em { font-family: 'DM Mono', monospace; font-size: 12px; flex: 1; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        .edit-bar { background: #0D0D0D; color: #F5F0EC; padding: 14px 48px; display: flex; align-items: center; justify-content: space-between; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; }
        .edit-section { padding: 40px 48px; border-bottom: 1px solid #D6CFC8; }
        .edit-section-title { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #8A8480; margin-bottom: 6px; }
        .edit-section-desc { font-size: 10px; color: #D6CFC8; margin-bottom: 24px; letter-spacing: 0.05em; }

        /* FEATURED GRID EDITÁVEL */
        .feat-edit-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2px; background: #D6CFC8; border: 1px solid #D6CFC8; margin-bottom: 32px; }
        .feat-slot { position: relative; background: #F0EBE5; display: flex; align-items: center; justify-content: center; min-height: 180px; transition: all 0.2s; }
        .feat-slot:first-child { grid-row: span 2; min-height: 362px; }
        .feat-slot.dragover { background: #FAD9E2; outline: 2px dashed #F2A7B8; }
        .feat-slot-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 100%; min-height: inherit; cursor: pointer; border: none; background: none; }
        .feat-slot-num { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: #D6CFC8; line-height: 1; }
        .feat-slot-hint { font-size: 9px; color: #D6CFC8; letter-spacing: 0.1em; text-transform: uppercase; }
        .feat-slot-filled { position: relative; width: 100%; height: 100%; min-height: inherit; overflow: hidden; }
        .feat-slot-filled img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .feat-slot-overlay { position: absolute; inset: 0; background: rgba(13,13,13,0); transition: background 0.2s; display: flex; align-items: flex-end; justify-content: space-between; padding: 10px; opacity: 0; }
        .feat-slot-filled:hover .feat-slot-overlay { background: rgba(13,13,13,0.5); opacity: 1; }
        .feat-slot-title { font-family: 'Cormorant Garamond', serif; font-size: 13px; color: #F5F0EC; font-weight: 300; }
        .slot-btn { background: rgba(13,13,13,0.7); border: none; color: #F5F0EC; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.1em; padding: 4px 8px; cursor: pointer; text-transform: uppercase; transition: background 0.15s; }
        .slot-btn:hover { background: #F2A7B8; color: #0D0D0D; }
        .slot-btn-remove { background: rgba(13,13,13,0.7); }

        /* OBRAS PARA ARRASTAR */
        .works-pool { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; background: #D6CFC8; border: 1px solid #D6CFC8; }
        .pool-item { background: #F5F0EC; display: flex; flex-direction: column; cursor: grab; transition: all 0.15s; position: relative; }
        .pool-item:active { cursor: grabbing; }
        .pool-item.is-featured { opacity: 0.4; cursor: default; }
        .pool-item.is-hidden { opacity: 0.3; }
        .pool-thumb { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 28px; overflow: hidden; position: relative; }
        .pool-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pool-info { padding: 8px 10px; border-top: 1px solid #E8E3DE; }
        .pool-title { font-family: 'Cormorant Garamond', serif; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pool-type { font-size: 9px; color: #8A8480; letter-spacing: 0.1em; text-transform: uppercase; }
        .pool-badge { position: absolute; top: 6px; left: 6px; background: #F2A7B8; color: #0D0D0D; font-size: 8px; padding: 2px 6px; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'DM Mono', monospace; }
        .pool-eye { position: absolute; top: 6px; right: 6px; background: rgba(13,13,13,0.6); border: none; color: #F5F0EC; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; transition: background 0.15s; }
        .pool-eye:hover { background: #0D0D0D; }

        /* CATÁLOGO EDITÁVEL */
        .catalog-row { display: grid; grid-template-columns: 40px 1fr 120px 80px 40px; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid #D6CFC8; transition: opacity 0.2s; }
        .catalog-row:first-child { border-top: 1px solid #D6CFC8; }
        .catalog-row.hidden-row { opacity: 0.35; }
        .work-thumb-sm { width: 36px; height: 36px; border: 1px solid #D6CFC8; display: flex; align-items: center; justify-content: center; font-size: 16px; overflow: hidden; flex-shrink: 0; }
        .work-thumb-sm img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .eye-btn { background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px; color: #8A8480; transition: color 0.15s; display: flex; align-items: center; justify-content: center; }
        .eye-btn:hover { color: #0D0D0D; }

        /* MODAL CROP */
        .crop-modal { position: fixed; inset: 0; background: rgba(13,13,13,0.85); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .crop-box { background: #F5F0EC; width: 600px; max-width: 95vw; display: flex; flex-direction: column; gap: 0; }
        .crop-header { padding: 16px 24px; border-bottom: 1px solid #D6CFC8; display: flex; justify-content: space-between; align-items: center; }
        .crop-preview { position: relative; aspect-ratio: 16/9; overflow: hidden; background: #0D0D0D; }
        .crop-preview img { position: absolute; inset: 0; width: 100%; height: 100%; }
        .crop-controls { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
        .crop-row { display: flex; flex-direction: column; gap: 8px; }
        .crop-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #8A8480; display: flex; justify-content: space-between; }
        .crop-slider { width: 100%; accent-color: #F2A7B8; }
        .crop-positions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: #D6CFC8; border: 1px solid #D6CFC8; }
        .pos-btn { background: #F5F0EC; border: none; padding: 8px; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.15s; }
        .pos-btn:hover, .pos-btn.active { background: #0D0D0D; color: #F5F0EC; }
        .crop-footer { padding: 16px 24px; border-top: 1px solid #D6CFC8; display: flex; gap: 8px; justify-content: flex-end; }
        .btn-sm-primary { background: #0D0D0D; color: #F5F0EC; border: none; padding: 8px 20px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; }
        .btn-sm-primary:hover { background: #F2A7B8; color: #0D0D0D; }
        .btn-sm-ghost { background: none; color: #0D0D0D; border: 1px solid #D6CFC8; padding: 8px 20px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; }
        .save-btn { background: #F2A7B8; color: #0D0D0D; border: none; padding: 6px 20px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; }
        .save-btn:disabled { opacity: 0.5; }
        .cancel-link { color: #8A8480; text-decoration: none; padding: 6px 16px; border: 1px solid #333; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }
      `}</style>

      <div className="em">

        {/* BARRA DE EDIÇÃO */}
        <div className="edit-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 6, height: 6, background: "#F2A7B8", borderRadius: "50%" }} />
            Modo edição ativo
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/dashboard" className="cancel-link">Cancelar</a>
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "✦ Salvar alterações"}
            </button>
          </div>
        </div>

        {/* SEÇÃO 1 — GRID DE DESTAQUES */}
        <div className="edit-section">
          <div className="edit-section-title">Grid de Destaques</div>
          <div className="edit-section-desc">
            Arraste uma obra da galeria abaixo para os slots do grid · máx. 5 obras · slot 01 ocupa 2 linhas
          </div>

          {/* GRID COM SLOTS */}
          <div className="feat-edit-grid">
            {featured.map((work, i) => (
              <div
                key={i}
                className={`feat-slot ${dragOverSlot === i ? "dragover" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOverSlot(i) }}
                onDragLeave={() => setDragOverSlot(null)}
                onDrop={e => {
                  e.preventDefault()
                  setDragOverSlot(null)
                  if (dragWorkId.current) {
                    setFeaturedSlot(dragWorkId.current, i)
                    dragWorkId.current = null
                  }
                }}
              >
                {work ? (
                  <div className="feat-slot-filled">
                    {work.fileUrl ? (
                      <img
                        src={work.fileUrl}
                        alt={work.title}
                        style={{
                          objectPosition: work.featuredPosition || "50% 50%",
                          transform: `scale(${work.featuredScale || 1})`,
                          transformOrigin: work.featuredPosition || "50% 50%",
                        }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", minHeight: "inherit", background: BG[i % 5], display: "flex", alignItems: "center", justifyContent: "center", fontSize: i === 0 ? 56 : 36 }}>
                        {typeIcon(work.type)}
                      </div>
                    )}
                    <div className="feat-slot-overlay">
                      <div className="feat-slot-title">{work.title}</div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {work.fileUrl && (
                          <button className="slot-btn" onClick={() => setEditingCrop(work.id)}>Crop</button>
                        )}
                        <button className="slot-btn slot-btn-remove" onClick={() => removeFromFeatured(work.id)}>✕</button>
                      </div>
                    </div>
                    <div style={{ position: "absolute", top: 8, left: 8, background: "#F2A7B8", color: "#0D0D0D", fontSize: 9, padding: "2px 6px", fontFamily: "DM Mono, monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                ) : (
                  <div className="feat-slot-empty">
                    <div className="feat-slot-num">{String(i + 1).padStart(2, "0")}</div>
                    <div className="feat-slot-hint">Arraste aqui</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* POOL DE OBRAS */}
          <div className="edit-section-title" style={{ marginBottom: 12 }}>Suas obras — arraste para o grid</div>
          <div className="works-pool">
            {works.filter(w => !w.hidden).map((w, i) => {
              const isFeatured = w.featuredOrder !== null
              return (
                <div
                  key={w.id}
                  className={`pool-item ${isFeatured ? "is-featured" : ""}`}
                  draggable={!isFeatured}
                  onDragStart={() => { dragWorkId.current = w.id }}
                  onDragEnd={() => { dragWorkId.current = null }}
                >
                  <div className="pool-thumb" style={{ background: BG[i % 5] }}>
                    {w.fileUrl
                      ? <img src={w.fileUrl} alt={w.title} />
                      : typeIcon(w.type)
                    }
                    {isFeatured && (
                      <div className="pool-badge">
                        Slot {String((w.featuredOrder ?? 0) + 1).padStart(2, "0")}
                      </div>
                    )}
                  </div>
                  <div className="pool-info">
                    <div className="pool-title serif">{w.title}</div>
                    <div className="pool-type">{w.type}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* SEÇÃO 2 — CATÁLOGO / OCULTAR */}
        <div className="edit-section">
          <div className="edit-section-title">Catálogo Completo</div>
          <div className="edit-section-desc">Clique no ● para ocultar uma obra do perfil público · obras ocultas aparecem apagadas</div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {works.map((w, i) => (
              <div key={w.id} className={`catalog-row ${w.hidden ? "hidden-row" : ""}`}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 16, fontWeight: 300, color: "#8A8480", textAlign: "right" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="work-thumb-sm" style={{ background: BG[i % 5] }}>
                    {w.fileUrl ? <img src={w.fileUrl} alt={w.title} /> : typeIcon(w.type)}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 15 }}>{w.title}</div>
                    <div style={{ fontSize: 10, color: "#8A8480", marginTop: 2 }}>
                      {w.hidden ? "● Oculta do público" : w.description || w.type}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 7px", border: "1px solid #D6CFC8", color: "#8A8480" }}>
                    {w.type}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: "#8A8480", textAlign: "right" }}>
                  {new Date(w.createdAt).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                </div>
                <button
                  className="eye-btn"
                  onClick={() => toggleHidden(w.id)}
                  title={w.hidden ? "Mostrar obra" : "Ocultar do público"}
                >
                  {w.hidden ? "○" : "●"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL CROP */}
      {cropWork && (
        <CropModal
          work={cropWork}
          onSave={(position, scale) => {
            updateCrop(cropWork.id, position, scale)
            setEditingCrop(null)
          }}
          onClose={() => setEditingCrop(null)}
        />
      )}
    </>
  )
}

function CropModal({
  work,
  onSave,
  onClose,
}: {
  work: { id: string; title: string; fileUrl: string | null; featuredPosition: string | null; featuredScale: number | null }
  onSave: (position: string, scale: number) => void
  onClose: () => void
}) {
  const [scale, setScale] = useState(work.featuredScale ?? 1)
  const [posX, setPosX] = useState(() => {
    const p = work.featuredPosition || "50% 50%"
    return parseInt(p.split(" ")[0]) || 50
  })
  const [posY, setPosY] = useState(() => {
    const p = work.featuredPosition || "50% 50%"
    return parseInt(p.split(" ")[1]) || 50
  })

  const position = `${posX}% ${posY}%`

  const PRESETS = [
    { label: "Topo esq", x: 0, y: 0 },
    { label: "Topo", x: 50, y: 0 },
    { label: "Topo dir", x: 100, y: 0 },
    { label: "Centro esq", x: 0, y: 50 },
    { label: "Centro", x: 50, y: 50 },
    { label: "Centro dir", x: 100, y: 50 },
    { label: "Baixo esq", x: 0, y: 100 },
    { label: "Baixo", x: 50, y: 100 },
    { label: "Baixo dir", x: 100, y: 100 },
  ]

  return (
    <div className="crop-modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="crop-box">
        <div className="crop-header">
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 300 }}>
            Ajustar imagem — <em style={{ fontStyle: "italic", color: "#F2A7B8" }}>{work.title}</em>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#8A8480" }}>✕</button>
        </div>

        <div className="crop-preview">
          {work.fileUrl && (
            <img
              src={work.fileUrl}
              alt={work.title}
              style={{
                objectFit: "cover",
                objectPosition: position,
                transform: `scale(${scale})`,
                transformOrigin: position,
              }}
            />
          )}
        </div>

        <div className="crop-controls">
          <div className="crop-row">
            <div className="crop-label">
              <span>Zoom</span>
              <span>{Math.round(scale * 100)}%</span>
            </div>
            <input
              type="range"
              className="crop-slider"
              min={1}
              max={3}
              step={0.05}
              value={scale}
              onChange={e => setScale(parseFloat(e.target.value))}
            />
          </div>

          <div className="crop-row">
            <div className="crop-label">
              <span>Posição horizontal</span>
              <span>{posX}%</span>
            </div>
            <input
              type="range"
              className="crop-slider"
              min={0}
              max={100}
              step={1}
              value={posX}
              onChange={e => setPosX(parseInt(e.target.value))}
            />
          </div>

          <div className="crop-row">
            <div className="crop-label">
              <span>Posição vertical</span>
              <span>{posY}%</span>
            </div>
            <input
              type="range"
              className="crop-slider"
              min={0}
              max={100}
              step={1}
              value={posY}
              onChange={e => setPosY(parseInt(e.target.value))}
            />
          </div>

          <div className="crop-row">
            <div className="crop-label"><span>Atalhos de posição</span></div>
            <div className="crop-positions">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  className={`pos-btn ${posX === p.x && posY === p.y ? "active" : ""}`}
                  onClick={() => { setPosX(p.x); setPosY(p.y) }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="crop-footer">
          <button className="btn-sm-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-sm-primary" onClick={() => onSave(position, scale)}>
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}