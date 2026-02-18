import Link from "next/link"

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        .land * { box-sizing: border-box; margin: 0; padding: 0; }
        .land { font-family: 'DM Mono', monospace; background: #0D0D0D; color: #F5F0EC; min-height: 100vh; display: flex; flex-direction: column; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        .land-nav { border-bottom: 1px solid #2A2A2A; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 48px; }
        .land-nav-logo { font-family: 'Cormorant Garamond', serif; font-size: 18px; letter-spacing: 0.15em; text-transform: uppercase; }
        .land-nav-links { display: flex; gap: 32px; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #8A8480; }
        .land-nav-links a { color: #8A8480; text-decoration: none; transition: color 0.2s; }
        .land-nav-links a:hover { color: #F5F0EC; }
        .land-hero { flex: 1; display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #2A2A2A; }
        .land-hero-left { padding: 80px 48px; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid #2A2A2A; }
        .land-hero-right { padding: 80px 48px; display: flex; flex-direction: column; justify-content: flex-end; background: #111; }
        .land-tag { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #F2A7B8; border: 1px solid #F2A7B8; display: inline-block; padding: 4px 10px; margin-bottom: 48px; width: fit-content; }
        .land-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(56px, 8vw, 96px); font-weight: 300; line-height: 0.95; letter-spacing: -0.02em; }
        .land-title em { font-style: italic; color: #F2A7B8; }
        .land-subtitle { font-size: 11px; line-height: 1.8; color: #8A8480; max-width: 380px; margin-top: 40px; }
        .land-actions { display: flex; gap: 16px; margin-top: 48px; align-items: center; }
        .btn-primary { background: #F5F0EC; color: #0D0D0D; border: none; padding: 12px 28px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; text-decoration: none; transition: background 0.2s; }
        .btn-primary:hover { background: #F2A7B8; }
        .btn-outline { background: none; color: #F5F0EC; border: 1px solid #2A2A2A; padding: 12px 28px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; text-decoration: none; transition: all 0.2s; }
        .btn-outline:hover { border-color: #F5F0EC; }
        .land-numbers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #2A2A2A; border: 1px solid #2A2A2A; margin-bottom: 48px; }
        .land-number-cell { background: #111; padding: 24px 20px; }
        .land-number-val { font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 300; line-height: 1; }
        .land-number-label { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: #8A8480; margin-top: 6px; }
        .land-quote { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 300; font-style: italic; line-height: 1.5; color: #8A8480; border-left: 2px solid #F2A7B8; padding-left: 20px; }
        .land-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #2A2A2A; border-top: 1px solid #2A2A2A; border-bottom: 1px solid #2A2A2A; }
        .land-feature { background: #0D0D0D; padding: 40px 32px; display: flex; flex-direction: column; gap: 16px; transition: background 0.2s; }
        .land-feature:hover { background: #111; }
        .land-feature-icon { font-size: 28px; }
        .land-feature-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; }
        .land-feature-desc { font-size: 11px; line-height: 1.7; color: #8A8480; }
        .land-footer { padding: 20px 48px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #8A8480; letter-spacing: 0.08em; text-transform: uppercase; border-top: 1px solid #2A2A2A; }
        .pink-dot { display: inline-block; width: 6px; height: 6px; background: #F2A7B8; border-radius: 50%; margin-right: 6px; }
        .land-divider { height: 1px; background: #2A2A2A; }
      `}</style>

      <div className="land">
        {/* NAV */}
        <nav className="land-nav">
          <div className="land-nav-logo serif">Mapoteca</div>
          <div className="land-nav-links">
            <a href="#">Explorar</a>
            <a href="#">Artistas</a>
            <a href="#">Blog</a>
          </div>
          <Link href="/login" className="btn-outline" style={{ padding: '6px 20px', fontSize: 10 }}>
            Entrar
          </Link>
        </nav>

        {/* HERO */}
        <div className="land-hero">
          <div className="land-hero-left">
            <div>
              <div className="land-tag">Plataforma para artistas</div>
              <h1 className="land-title serif">
                Sua obra,<br />
                <em>organizada</em><br />
                e viva.
              </h1>
              <p className="land-subtitle">
                A Mapoteca é o espaço do artista para catalogar, organizar e compartilhar sua produção — pinturas, desenhos, poesia, contos, fotografia e muito mais.
              </p>
              <div className="land-actions">
                <Link href="/login" className="btn-primary">
                  Criar meu perfil
                </Link>
                <Link href="#como-funciona" className="btn-outline">
                  Como funciona
                </Link>
              </div>
            </div>

            <div style={{ fontSize: 10, color: '#8A8480', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 48 }}>
              Gratuito · Sem anúncios · Seu portfólio para sempre
            </div>
          </div>

          <div className="land-hero-right">
            <div className="land-numbers">
              <div className="land-number-cell">
                <div className="land-number-val serif">∞</div>
                <div className="land-number-label">Tipos de obra</div>
              </div>
              <div className="land-number-cell">
                <div className="land-number-val serif" style={{ color: '#F2A7B8' }}>∅</div>
                <div className="land-number-label">Anúncios</div>
              </div>
              <div className="land-number-cell">
                <div className="land-number-val serif">01</div>
                <div className="land-number-label">Lugar para sua arte</div>
              </div>
            </div>

            <div className="land-quote">
              "Um artista sem arquivo é um artista sem memória."
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div id="como-funciona" className="land-features">
          {[
            { icon: "◈", title: "Catálogo completo", desc: "Organize todas as suas obras em um só lugar. Pinturas, desenhos, poesias, contos, fotografias — tudo catalogado com suas informações, datas e técnicas." },
            { icon: "✦", title: "Coleções e séries", desc: "Agrupe suas obras em coleções e séries. Dê contexto à sua produção e mostre a evolução do seu trabalho ao longo do tempo." },
            { icon: "☽", title: "Perfil público", desc: "Compartilhe sua obra com o mundo quando quiser. Ative seu perfil público e tenha um portfólio elegante para enviar a galerias e curadores." },
          ].map(f => (
            <div key={f.title} className="land-feature">
              <div className="land-feature-icon">{f.icon}</div>
              <div className="land-feature-title serif">{f.title}</div>
              <div className="land-feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA FINAL */}
        <div style={{ padding: '80px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center', borderBottom: '1px solid #2A2A2A' }}>
          <div className="serif" style={{ fontSize: 48, fontWeight: 300, lineHeight: 1.1 }}>
            Comece a catalogar<br />
            <em style={{ fontStyle: 'italic', color: '#F2A7B8' }}>sua produção hoje.</em>
          </div>
          <p style={{ fontSize: 11, color: '#8A8480', maxWidth: 400, lineHeight: 1.8 }}>
            Crie seu perfil gratuitamente e dê à sua obra o espaço que ela merece.
          </p>
          <Link href="/login" className="btn-primary" style={{ marginTop: 8 }}>
            Criar meu perfil gratuitamente
          </Link>
        </div>

        {/* FOOTER */}
        <footer className="land-footer">
          <span><span className="pink-dot" />Mapoteca · 2025</span>
          <span>Feito para artistas</span>
        </footer>
      </div>
    </>
  )
}