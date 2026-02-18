import Link from "next/link"

export default function WelcomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        .wel * { box-sizing: border-box; margin: 0; padding: 0; }
        .wel { font-family: 'DM Mono', monospace; background: #F5F0EC; color: #0D0D0D; min-height: 100vh; display: flex; flex-direction: column; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        .wel-nav { border-bottom: 1px solid #0D0D0D; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 48px; }
        .wel-body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; }
        .wel-left { padding: 80px 64px; border-right: 1px solid #0D0D0D; display: flex; flex-direction: column; gap: 48px; }
        .wel-right { padding: 80px 64px; background: #F9F5F1; display: flex; flex-direction: column; gap: 32px; }
        .wel-tag { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #F2A7B8; }
        .wel-title { font-family: 'Cormorant Garamond', serif; font-size: 56px; font-weight: 300; line-height: 1; }
        .wel-title em { font-style: italic; color: #F2A7B8; }
        .wel-desc { font-size: 11px; line-height: 1.9; color: #8A8480; }
        .step { display: flex; gap: 20px; align-items: flex-start; padding: 24px 0; border-bottom: 1px solid #E8E3DE; }
        .step:first-child { border-top: 1px solid #E8E3DE; }
        .step-num { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: #D6CFC8; line-height: 1; flex-shrink: 0; width: 40px; }
        .step.active .step-num { color: #F2A7B8; }
        .step-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; margin-bottom: 6px; }
        .step-desc { font-size: 11px; color: #8A8480; line-height: 1.7; }
        .step-action { margin-top: 12px; }
        .btn-primary { background: #0D0D0D; color: #F5F0EC; border: none; padding: 12px 28px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; text-decoration: none; display: inline-block; transition: background 0.2s; }
        .btn-primary:hover { background: #F2A7B8; color: #0D0D0D; }
        .btn-ghost { background: none; color: #0D0D0D; border: 1px solid #0D0D0D; padding: 12px 28px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; }
        .btn-ghost:hover { background: #0D0D0D; color: #F5F0EC; }
        .wel-footer { border-top: 1px solid #0D0D0D; padding: 16px 48px; display: flex; justify-content: space-between; font-size: 10px; color: #8A8480; letter-spacing: 0.08em; text-transform: uppercase; }
        .pink-dot { display: inline-block; width: 6px; height: 6px; background: #F2A7B8; border-radius: 50%; margin-right: 6px; }
        .info-card { background: #F5F0EC; border: 1px solid #D6CFC8; padding: 24px; display: flex; flex-direction: column; gap: 8px; }
        .info-card-icon { font-size: 20px; }
        .info-card-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; }
        .info-card-desc { font-size: 10px; color: #8A8480; line-height: 1.6; letter-spacing: 0.03em; }
      `}</style>

      <div className="wel">
        <nav className="wel-nav">
          <div className="serif" style={{ fontSize: 18, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Mapoteca</div>
          <div style={{ fontSize: 10, color: '#8A8480', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Configuração inicial
          </div>
        </nav>

        <div className="wel-body">
          <div className="wel-left">
            <div>
              <div className="wel-tag">Bem-vindo à Mapoteca</div>
              <div className="wel-title serif" style={{ marginTop: 16 }}>
                Vamos montar<br />
                <em>seu espaço.</em>
              </div>
              <p className="wel-desc" style={{ marginTop: 24 }}>
                Em poucos passos você terá um catálogo elegante de toda a sua produção artística — pronto para compartilhar com o mundo ou guardar só para você.
              </p>
            </div>

            <div>
              <div className="step active">
                <div className="step-num">01</div>
                <div>
                  <div className="step-title serif">Configure seu perfil</div>
                  <div className="step-desc">Defina seu nome de artista, bio e o endereço do seu perfil público. Leva menos de 2 minutos.</div>
                  <div className="step-action">
                    <Link href="/dashboard/perfil" className="btn-primary">
                      Configurar agora →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step-num">02</div>
                <div>
                  <div className="step-title serif">Adicione sua primeira obra</div>
                  <div className="step-desc">Suba uma imagem ou escreva um texto. Sua primeira entrada no catálogo.</div>
                </div>
              </div>

              <div className="step">
                <div className="step-num">03</div>
                <div>
                  <div className="step-title serif">Organize em coleções</div>
                  <div className="step-desc">Agrupe obras por série, período ou tema. Dê estrutura à sua produção.</div>
                </div>
              </div>

              <div className="step">
                <div className="step-num">04</div>
                <div>
                  <div className="step-title serif">Compartilhe seu perfil</div>
                  <div className="step-desc">Quando quiser, ative seu perfil público e compartilhe sua obra com o mundo.</div>
                </div>
              </div>
            </div>

            <div>
              <Link href="/dashboard" className="btn-ghost">
                Explorar o dashboard primeiro
              </Link>
            </div>
          </div>

          <div className="wel-right">
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A8480', borderTop: '1px solid #D6CFC8', paddingTop: 12 }}>
              O que você pode catalogar
            </div>

            {[
              { icon: "🎨", title: "Artes visuais", desc: "Pinturas, desenhos, gravuras, aquarelas, esculturas, instalações — qualquer obra visual com upload de imagem." },
              { icon: "✦", title: "Poesia e textos", desc: "Escreva direto na Mapoteca ou suba um arquivo. Cada poema recebe sua própria entrada no catálogo." },
              { icon: "☽", title: "Contos e prosa", desc: "Do conto de uma página ao romance. Organize capítulos, versões e rascunhos em uma só coleção." },
              { icon: "◈", title: "Fotografia", desc: "Séries fotográficas com metadados técnicos. Câmera, lente, data, local." },
              { icon: "♪", title: "Música e performance", desc: "Links para áudio, vídeo ou documentação de performances e composições." },
            ].map(c => (
              <div key={c.title} className="info-card">
                <div className="info-card-icon">{c.icon}</div>
                <div className="info-card-title serif">{c.title}</div>
                <div className="info-card-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <footer className="wel-footer">
          <span><span className="pink-dot" />Mapoteca</span>
          <span>Passo 1 de 4</span>
        </footer>
      </div>
    </>
  )
}