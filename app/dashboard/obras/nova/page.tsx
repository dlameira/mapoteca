"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

const TIPOS = [
  { value: "PINTURA", label: "Pintura", icon: "🎨" },
  { value: "DESENHO", label: "Desenho", icon: "◈" },
  { value: "POESIA", label: "Poesia", icon: "✦" },
  { value: "CONTO", label: "Conto", icon: "☽" },
  { value: "FOTOGRAFIA", label: "Fotografia", icon: "📷" },
  { value: "MUSICA", label: "Música", icon: "♪" },
  { value: "OUTRO", label: "Outro", icon: "◇" },
]

const CAPAS_GERADAS = [
  { bg: "#E8DDD5", fg: "#8B7355" },
  { bg: "#FAD9E2", fg: "#C4607A" },
  { bg: "#D5E0D8", fg: "#5A7A6B" },
  { bg: "#E0D5E8", fg: "#6B5A8B" },
  { bg: "#D5DDE0", fg: "#5A6B7A" },
]

export default function NovaObraPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [capaMode, setCapaMode] = useState<"upload" | "gerada">("gerada")
  const [capaColor, setCapaColor] = useState(0)
  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    content: "",
    tags: "",
    technique: "",
    dimensions: "",
    year: new Date().getFullYear().toString(),
    published: true,
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith("image/")) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const isTexto = form.type === "POESIA" || form.type === "CONTO"
  const isVisual =
    form.type === "PINTURA" ||
    form.type === "DESENHO" ||
    form.type === "FOTOGRAFIA"

  async function handleSubmit() {
    if (!form.title || !form.type) return

    if (isVisual && !imageFile) {
      alert("Por favor, adicione uma imagem para esta obra.")
      return
    }

    setLoading(true)

    try {
      let fileUrl: string | null = null

      // Upload da imagem se houver
      if (imageFile) {
        setUploading(true)
        try {
          const ext = imageFile.name.split(".").pop()
          const filename = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${ext}`

          const { error: uploadError } = await supabase.storage
            .from("obras")
            .upload(filename, imageFile)

          if (uploadError) throw uploadError

          const { data: urlData } = supabase.storage
            .from("obras")
            .getPublicUrl(filename)

          fileUrl = urlData.publicUrl
        } finally {
          setUploading(false)
        }
      }

      const res = await fetch("/dashboard/obras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fileUrl,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      })

      if (res.ok) {
        router.push("/dashboard")
        return
      }

      const text = await res.text()
      console.error("SAVE WORK ERROR:", res.status, text)
      alert(`Erro ao salvar obra (${res.status}):\n${text}`)
    } catch (err: unknown) {
      console.error("SUBMIT ERROR RAW:", err)
      const message =
        err instanceof Error ? err.message : JSON.stringify(err, null, 2)
      alert("Erro:\n" + message)
    } finally {
      setLoading(false)
    }
  }

  const tipoSelecionado = TIPOS.find((t) => t.value === form.type)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        .nova * { box-sizing: border-box; margin: 0; padding: 0; }
        .nova { font-family: 'DM Mono', monospace; background: #F5F0EC; color: #0D0D0D; min-height: 100vh; display: flex; flex-direction: column; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        .nova-nav { border-bottom: 1px solid #0D0D0D; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 48px; }
        .nova-body { flex: 1; display: grid; grid-template-columns: 1fr 360px; }
        .nova-form { padding: 48px 64px; display: flex; flex-direction: column; gap: 32px; border-right: 1px solid #0D0D0D; overflow-y: auto; }
        .nova-side { padding: 48px 40px; background: #F9F5F1; display: flex; flex-direction: column; gap: 24px; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
        .field { display: flex; flex-direction: column; gap: 8px; }
        .field-label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #8A8480; }
        .field-input { background: #F5F0EC; border: 1px solid #D6CFC8; padding: 12px 16px; font-family: 'DM Mono', monospace; font-size: 12px; color: #0D0D0D; outline: none; transition: border-color 0.2s; width: 100%; }
        .field-input:focus { border-color: #0D0D0D; }
        .field-textarea { background: #F5F0EC; border: 1px solid #D6CFC8; padding: 16px; font-family: 'DM Mono', monospace; font-size: 12px; color: #0D0D0D; outline: none; transition: border-color 0.2s; width: 100%; resize: vertical; min-height: 200px; line-height: 1.8; }
        .field-textarea:focus { border-color: #0D0D0D; }
        .field-textarea.large { min-height: 320px; font-size: 15px; font-family: 'Cormorant Garamond', serif; }
        .field-hint { font-size: 10px; color: #8A8480; line-height: 1.6; }
        .tipos-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #D6CFC8; border: 1px solid #D6CFC8; }
        .tipo-btn { background: #F5F0EC; padding: 16px 8px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; transition: all 0.15s; border: none; font-family: 'DM Mono', monospace; }
        .tipo-btn:hover { background: #E8E3DE; }
        .tipo-btn.selected { background: #0D0D0D; color: #F5F0EC; }
        .tipo-icon { font-size: 20px; line-height: 1; }
        .tipo-label { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; }
        .two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .btn-primary { background: #0D0D0D; color: #F5F0EC; border: none; padding: 14px 32px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.2s; width: 100%; }
        .btn-primary:hover { background: #F2A7B8; color: #0D0D0D; }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-ghost { background: none; border: 1px solid #D6CFC8; padding: 10px 24px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; text-decoration: none; color: #0D0D0D; display: inline-block; text-align: center; width: 100%; }
        .btn-ghost:hover { border-color: #0D0D0D; }
        .upload-area { border: 1px dashed #D6CFC8; padding: 40px 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; }
        .upload-area:hover { border-color: #0D0D0D; background: #F0EBE5; }
        .upload-preview { width: 100%; aspect-ratio: 4/3; object-fit: cover; border: 1px solid #D6CFC8; }
        .toggle-wrap { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .toggle-box { width: 32px; height: 18px; border: 1px solid #D6CFC8; position: relative; transition: background 0.2s; flex-shrink: 0; }
        .toggle-box.on { background: #0D0D0D; border-color: #0D0D0D; }
        .toggle-knob { position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; background: #D6CFC8; transition: all 0.2s; }
        .toggle-box.on .toggle-knob { left: 16px; background: #F2A7B8; }
        .section-divider { border-top: 1px solid #D6CFC8; padding-top: 24px; }
        .nova-footer { border-top: 1px solid #0D0D0D; padding: 16px 48px; display: flex; justify-content: space-between; font-size: 10px; color: #8A8480; letter-spacing: 0.08em; text-transform: uppercase; }
        .pink-dot { display: inline-block; width: 6px; height: 6px; background: #F2A7B8; border-radius: 50%; margin-right: 6px; }
        .char-count { font-size: 10px; color: #8A8480; text-align: right; }
        .capa-tabs { display: flex; gap: 1px; background: #D6CFC8; border: 1px solid #D6CFC8; margin-bottom: 12px; }
        .capa-tab { flex: 1; padding: 10px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; border: none; cursor: pointer; background: #F5F0EC; transition: all 0.15s; }
        .capa-tab.active { background: #0D0D0D; color: #F5F0EC; }
        .capa-gerada { aspect-ratio: 3/4; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 24px; text-align: center; }
        .capa-colors { display: flex; gap: 8px; margin-top: 8px; }
        .capa-color-dot { width: 20px; height: 20px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: all 0.15s; }
        .capa-color-dot.selected { border-color: #0D0D0D; transform: scale(1.2); }
      `}</style>

      <div className="nova">
        <nav className="nova-nav">
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a
              href="/dashboard"
              style={{
                color: "#8A8480",
                textDecoration: "none",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              ← Dashboard
            </a>
            <div
              className="serif"
              style={{
                fontSize: 18,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Nova Obra
            </div>
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#8A8480",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {tipoSelecionado
              ? `${tipoSelecionado.icon} ${tipoSelecionado.label}`
              : "Selecione o tipo"}
          </div>
        </nav>

        <div className="nova-body">
          <div className="nova-form">
            {/* TIPO */}
            <div className="field">
              <div className="field-label">Tipo de obra *</div>
              <div className="tipos-grid">
                {TIPOS.map((t) => (
                  <button
                    key={t.value}
                    className={`tipo-btn ${
                      form.type === t.value ? "selected" : ""
                    }`}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, type: t.value }))
                    }
                    type="button"
                  >
                    <span className="tipo-icon">{t.icon}</span>
                    <span className="tipo-label">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TÍTULO */}
            <div className="field">
              <div className="field-label">Título *</div>
              <input
                className="field-input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Título da obra"
                style={{
                  fontSize: 16,
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              />
            </div>

            {/* UPLOAD para artes visuais */}
            {isVisual && (
              <div className="field">
                <div className="field-label">Imagem *</div>
                {imagePreview ? (
                  <div style={{ position: "relative" }}>
                    <img
                      src={imagePreview}
                      className="upload-preview"
                      alt="Preview"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "#0D0D0D",
                        color: "#F5F0EC",
                        border: "none",
                        padding: "4px 10px",
                        fontSize: 10,
                        cursor: "pointer",
                        fontFamily: "DM Mono, monospace",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Trocar
                    </button>
                  </div>
                ) : (
                  <label
                    className="upload-area"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: "none" }}
                    />
                    <div style={{ fontSize: 28 }}>◈</div>
                    <div
                      style={{ fontSize: 11, color: "#8A8480", lineHeight: 1.6 }}
                    >
                      Arraste uma imagem aqui
                      <br />
                      ou clique para selecionar
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "#D6CFC8",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      JPG, PNG, WEBP · Máx. 10MB
                    </div>
                  </label>
                )}
              </div>
            )}

            {/* CAPA para textos */}
            {isTexto && (
              <div className="field">
                <div className="field-label">Capa</div>
                <div className="capa-tabs">
                  <button
                    type="button"
                    className={`capa-tab ${capaMode === "gerada" ? "active" : ""}`}
                    onClick={() => setCapaMode("gerada")}
                  >
                    Gerar automaticamente
                  </button>
                  <button
                    type="button"
                    className={`capa-tab ${capaMode === "upload" ? "active" : ""}`}
                    onClick={() => setCapaMode("upload")}
                  >
                    Subir imagem
                  </button>
                </div>

                {capaMode === "gerada" && (
                  <div>
                    <div
                      className="capa-gerada"
                      style={{
                        background: CAPAS_GERADAS[capaColor].bg,
                        border: "1px solid #D6CFC8",
                      }}
                    >
                      <div style={{ fontSize: 32 }}>
                        {tipoSelecionado?.icon || "✦"}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 20,
                          fontWeight: 300,
                          color: CAPAS_GERADAS[capaColor].fg,
                          lineHeight: 1.2,
                        }}
                      >
                        {form.title || "Título da obra"}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: CAPAS_GERADAS[capaColor].fg,
                          opacity: 0.6,
                        }}
                      >
                        {tipoSelecionado?.label || "Tipo"}
                      </div>
                    </div>
                    <div className="capa-colors">
                      {CAPAS_GERADAS.map((c, i) => (
                        <div
                          key={i}
                          className={`capa-color-dot ${
                            capaColor === i ? "selected" : ""
                          }`}
                          style={{ background: c.bg }}
                          onClick={() => setCapaColor(i)}
                        />
                      ))}
                    </div>
                    <div className="field-hint" style={{ marginTop: 8 }}>
                      A capa será gerada com o título e tipo da obra.
                    </div>
                  </div>
                )}

                {capaMode === "upload" &&
                  (imagePreview ? (
                    <div style={{ position: "relative" }}>
                      <img
                        src={imagePreview}
                        className="upload-preview"
                        alt="Preview"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview(null)
                        }}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "#0D0D0D",
                          color: "#F5F0EC",
                          border: "none",
                          padding: "4px 10px",
                          fontSize: 10,
                          cursor: "pointer",
                        }}
                      >
                        Trocar
                      </button>
                    </div>
                  ) : (
                    <label className="upload-area">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: "none" }}
                      />
                      <div style={{ fontSize: 28 }}>◈</div>
                      <div style={{ fontSize: 11, color: "#8A8480" }}>
                        Clique para selecionar uma capa
                      </div>
                    </label>
                  ))}
              </div>
            )}

            {/* CONTEÚDO TEXTO */}
            {isTexto && (
              <div className="field">
                <div className="field-label">
                  {form.type === "POESIA" ? "Poema" : "Texto"}
                </div>
                <textarea
                  className="field-textarea large"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder={
                    form.type === "POESIA"
                      ? "Escreva seu poema aqui..."
                      : "Escreva seu conto aqui..."
                  }
                />
                <div className="char-count">
                  {form.content.length} caracteres ·{" "}
                  {form.content.split(/\s+/).filter(Boolean).length} palavras
                </div>
              </div>
            )}

            {/* DESCRIÇÃO */}
            <div className="field">
              <div className="field-label">Nota do artista</div>
              <textarea
                className="field-textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Contexto, inspiração, técnica..."
                style={{ minHeight: 100 }}
              />
            </div>

            {/* TÉCNICA E DIMENSÕES (ainda não existe no schema, mas pode ficar no form por enquanto) */}
            {isVisual && (
              <div className="two-cols section-divider">
                <div className="field">
                  <div className="field-label">Técnica</div>
                  <input
                    className="field-input"
                    name="technique"
                    value={form.technique}
                    onChange={handleChange}
                    placeholder="Ex: Óleo sobre tela"
                  />
                </div>
                <div className="field">
                  <div className="field-label">Dimensões</div>
                  <input
                    className="field-input"
                    name="dimensions"
                    value={form.dimensions}
                    onChange={handleChange}
                    placeholder="Ex: 60×80cm"
                  />
                </div>
              </div>
            )}

            {/* ANO E TAGS (year ainda não está no schema, mas pode ficar no form por enquanto) */}
            <div className="two-cols section-divider">
              <div className="field">
                <div className="field-label">Ano de criação</div>
                <input
                  className="field-input"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="2024"
                />
              </div>
              <div className="field">
                <div className="field-label">Tags</div>
                <input
                  className="field-input"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="memória, natureza"
                />
                <div className="field-hint">Separe com vírgulas</div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="nova-side">
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8A8480",
                borderTop: "1px solid #D6CFC8",
                paddingTop: 12,
              }}
            >
              Publicação
            </div>

            <div
              className="toggle-wrap"
              onClick={() =>
                setForm((prev) => ({ ...prev, published: !prev.published }))
              }
            >
              <div className={`toggle-box ${form.published ? "on" : ""}`}>
                <div className="toggle-knob" />
              </div>
              <div>
                <div style={{ fontSize: 11 }}>
                  {form.published ? "Obra pública" : "Obra privada"}
                </div>
                <div className="field-hint" style={{ marginTop: 2 }}>
                  {form.published ? "Visível no perfil público" : "Só você pode ver"}
                </div>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading || !form.title || !form.type || (isVisual && !imageFile)}
              type="button"
            >
              {uploading
                ? "Enviando imagem..."
                : loading
                ? "Salvando..."
                : "✦ Adicionar ao catálogo"}
            </button>

            <a href="/dashboard" className="btn-ghost">
              Cancelar
            </a>

            {/* PREVIEW */}
            {form.title && form.type && (
              <>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#8A8480",
                    borderTop: "1px solid #D6CFC8",
                    paddingTop: 16,
                    marginTop: 8,
                  }}
                >
                  Pré-visualização
                </div>
                <div style={{ border: "1px solid #D6CFC8", overflow: "hidden" }}>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                        display: "block",
                      }}
                      alt="preview"
                    />
                  ) : (
                    <div
                      style={{
                        background: CAPAS_GERADAS[capaColor].bg,
                        aspectRatio: "4/3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 36,
                      }}
                    >
                      {tipoSelecionado?.icon}
                    </div>
                  )}
                  <div
                    style={{
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 16,
                      }}
                    >
                      {form.title}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#F2A7B8",
                        border: "1px solid #F2A7B8",
                        padding: "2px 6px",
                        display: "inline-block",
                        width: "fit-content",
                      }}
                    >
                      {tipoSelecionado?.label}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <footer className="nova-footer">
          <span>
            <span className="pink-dot" />
            Mapoteca
          </span>
          <span>{form.title || "Nova obra"}</span>
        </footer>
      </div>
    </>
  )
}
