"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PerfilPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    bio: "",
    isPublic: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === "name" && !form.slug ? { slug: value.toLowerCase().replace(/\s+/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "") } : {}),
    }))
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await fetch("/api/perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.push("/dashboard")
      } else {
        alert("Erro ao salvar perfil. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        .perf * { box-sizing: border-box; margin: 0; padding: 0; }
        .perf { font-family: 'DM Mono', monospace; background: #F5F0EC; color: #0D0D0D; min-height: 100vh; display: flex; flex-direction: column; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        .perf-nav { border-bottom: 1px solid #0D0D0D; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 48px; }
        .perf-body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; }
        .perf-left { padding: 64px; border-right: 1px solid #0D0D0D; display: flex; flex-direction: column; gap: 40px; }
        .perf-right { padding: 64px; background: #F9F5F1; display: flex; flex-direction: column; gap: 32px; }
        .field { display: flex; flex-direction: column; gap: 8px; }
        .field-label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #8A8480; }
        .field-input { background: #F5F0EC; border: 1px solid #D6CFC8; padding: 12px 16px; font-family: 'DM Mono', monospace; font-size: 12px; color: #0D0D0D; outline: none; transition: border-color 0.2s; width: 100%; }
        .field-input:focus { border-color: #0D0D0D; }
        .field-textarea { background: #F5F0EC; border: 1px solid #D6CFC8; padding: 12px 16px; font-family: 'DM Mono', monospace; font-size: 12px; color: #0D0D0D; outline: none; transition: border-color 0.2s; width: 100%; resize: vertical; min-height: 120px; line-height: 1.7; }
        .field-textarea:focus { border-color: #0D0D0D; }
        .field-hint { font-size: 10px; color: #8A8480; line-height: 1.6; }
        .slug-preview { font-size: 11px; color: #F2A7B8; margin-top: 4px; letter-spacing: 0.05em; }
        .toggle-wrap { display: flex; align-items: center; gap: 16px; padding: 16px; border: 1px solid #D6CFC8; cursor: pointer; transition: border-color 0.2s; }
        .toggle-wrap:hover { border-color: #0D0D0D; }
        .toggle-box { width: 36px; height: 20px; border: 1px solid #D6CFC8; position: relative; transition: background 0.2s; flex-shrink: 0; }
        .toggle-box.on { background: #0D0D0D; border-color: #0D0D0D; }
        .toggle-knob { position: absolute; top: 3px; left: 3px; width: 12px; height: 12px; background: #D6CFC8; transition: all 0.2s; }
        .toggle-box.on .toggle-knob { left: 19px; background: #F2A7B8; }
        .btn-primary { background: #0D0D0D; color: #F5F0EC; border: none; padding: 14px 32px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.2s; }
        .btn-primary:hover { background: #F2A7B8; color: #0D0D0D; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .preview-card { border: 1px solid #D6CFC8; padding: 32px; display: flex; flex-direction: column; gap: 16px; }
        .preview-avatar { width: 64px; height: 64px; background: #FAD9E2; border: 1px solid #0D0D0D; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 300; }
        .perf-footer { border-top: 1px solid #0D0D0D; padding: 16px 48px; display: flex; justify-content: space-between; font-size: 10px; color: #8A8480; letter-spacing: 0.08em; text-transform: uppercase; }
        .pink-dot { display: inline-block; width: 6px; height: 6px; background: #F2A7B8; border-radius: 50%; margin-right: 6px; }
        .section-label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #8A8480; border-top: 1px solid #D6CFC8; padding-top: 12px; }
      `}</style>

      <div className="perf">
        <nav className="perf-nav">
          <div className="serif" style={{ fontSize: 18, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Mapoteca</div>
          <div style={{ fontSize: 10, color: '#8A8480', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Configurar perfil</div>
        </nav>

        <div className="perf-body">
          {/* FORM */}
          <div className="perf-left">
            <div>
              <div style={{ fontSize: 10, color: '#F2A7B8', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Passo 1 de 4</div>
              <div className="serif" style={{ fontSize: 40, fontWeight: 300, lineHeight: 1.1, marginTop: 12 }}>
                Seu perfil<br />
                <em style={{ fontStyle: 'italic', color: '#F2A7B8' }}>de artista.</em>
              </div>
            </div>

            <div className="field">
              <div className="field-label">Nome artístico *</div>
              <input
                className="field-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Como você assina sua obra"
              />
            </div>

            <div className="field">
              <div className="field-label">Endereço do perfil *</div>
              <input
                className="field-input"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="seunome"
              />
              <div className="slug-preview">
                mapoteca.com/<strong>{form.slug || "seunome"}</strong>
              </div>
              <div className="field-hint">Apenas letras minúsculas e números, sem espaços.</div>
            </div>

            <div className="field">
              <div className="field-label">Bio</div>
              <textarea
                className="field-textarea"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Conte um pouco sobre você e sua obra..."
              />
              <div className="field-hint">Aparecerá no seu perfil público. Máximo 280 caracteres.</div>
            </div>

            <div>
              <div className="field-label" style={{ marginBottom: 12 }}>Visibilidade do perfil</div>
              <div
                className="toggle-wrap"
                onClick={() => setForm(prev => ({ ...prev, isPublic: !prev.isPublic }))}
              >
                <div className={`toggle-box ${form.isPublic ? 'on' : ''}`}>
                  <div className="toggle-knob" />
                </div>
                <div>
                  <div style={{ fontSize: 11 }}>{form.isPublic ? 'Perfil público' : 'Perfil privado'}</div>
                  <div className="field-hint" style={{ marginTop: 2 }}>
                    {form.isPublic ? 'Qualquer pessoa pode ver seu perfil e obras públicas.' : 'Só você pode ver seu perfil.'}
                  </div>
                </div>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading || !form.name || !form.slug}
            >
              {loading ? 'Salvando...' : 'Salvar e continuar →'}
            </button>
          </div>

          {/* PREVIEW */}
          <div className="perf-right">
            <div className="section-label">Pré-visualização do perfil</div>

            <div className="preview-card">
              <div className="preview-avatar serif">
                {form.name ? form.name[0].toUpperCase() : '?'}
              </div>
              <div>
                <div className="serif" style={{ fontSize: 28, fontWeight: 300, lineHeight: 1.1 }}>
                  {form.name || 'Seu nome'}
                </div>
                <div style={{ fontSize: 10, color: '#F2A7B8', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 6 }}>
                  @{form.slug || 'seunome'}
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#8A8480', lineHeight: 1.7, fontStyle: form.bio ? 'normal' : 'italic' }}>
                {form.bio || 'Sua bio aparecerá aqui...'}
              </div>
              <div style={{ borderTop: '1px solid #D6CFC8', paddingTop: 16, display: 'flex', gap: 24 }}>
                {[{ n: '0', l: 'Obras' }, { n: '0', l: 'Coleções' }].map(s => (
                  <div key={s.l}>
                    <div className="serif" style={{ fontSize: 20, fontWeight: 300 }}>{s.n}</div>
                    <div style={{ fontSize: 9, color: '#8A8480', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 10, color: '#8A8480', lineHeight: 1.8, borderTop: '1px solid #D6CFC8', paddingTop: 16 }}>
              Você poderá alterar todas essas informações a qualquer momento nas configurações do seu perfil.
            </div>
          </div>
        </div>

        <footer className="perf-footer">
          <span><span className="pink-dot" />Mapoteca</span>
          <span>Passo 1 de 4</span>
        </footer>
      </div>
    </>
  )
}