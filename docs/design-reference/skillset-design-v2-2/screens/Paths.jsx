/* Learning Paths — curated programs, with a deep landing detail mode */

const Paths = ({ setRoute }) => {
  const D = window.SkillsetData;

  const pathsRich = [
    { ...D.paths[0], bg: 'linear-gradient(135deg, #2c5282 0%, #0f2744 100%)', tags: ['Design', 'Self-paced', 'Cert. on completion'] },
    { ...D.paths[1], bg: 'linear-gradient(135deg, #b22234 0%, #6e0e1c 100%)', tags: ['Leadership', 'Cohort', '+2 live sessions'] },
    { ...D.paths[2], bg: 'linear-gradient(135deg, #c07b0a 0%, #6f4806 100%)', tags: ['Writing', 'Self-paced + reviews'] },
    { ...D.paths[3], bg: 'linear-gradient(135deg, #1f8a5b 0%, #115d3c 100%)', tags: ['AI fluency', 'Project-based'] },
  ];

  return (
    <div>
      {/* Header */}
      <div className="fade-in" style={{ marginBottom: 28 }}>
        <span className="eyebrow">Learning paths</span>
        <h1 className="display-h2" style={{ marginTop: 10 }}>Curated programs with one specific destination.</h1>
        <p className="lede" style={{ marginTop: 12, fontSize: 15 }}>
          Each path bundles courses, live cohorts, a private community room, and a verified credential. We don\u2019t launch a new one until we\u2019ve found the right faculty.
        </p>
      </div>

      <div className="lp-grid fade-in d1">
        {pathsRich.map((p) => (
          <div key={p.id} className="lp-card" onClick={() => setRoute('course')}>
            <div className="hero-strip" style={{ background: p.bg }}>
              <div className="hero-meta">
                <span className="chip" style={{ background: 'rgba(255,255,255,0.96)' }}>{p.tags[0]}</span>
              </div>
              <div className="glyph-big">{p.glyph}</div>
            </div>
            <div className="body">
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="pillrow">
                {p.tags.slice(1).map((t, i) => <span key={i}>{t}</span>)}
              </div>
              <div className="stats">
                <div><div className="v">{p.modules}</div><div className="l">Modules</div></div>
                <div><div className="v">{p.hours}h</div><div className="l">Total</div></div>
                <div><div className="v">{p.completers}</div><div className="l">Completers</div></div>
              </div>
              <div className="actions">
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>View path <Icon name="arrowR" size={11} /></button>
                <button className="btn btn-ghost btn-sm"><Icon name="bookmark" size={11} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* In-depth detail of one path */}
      <div className="sec-head fade-in d2" style={{ marginTop: 56 }}>
        <div>
          <span className="eyebrow brand">Featured path</span>
          <h2>Become a Product Designer · 12 weeks.</h2>
        </div>
      </div>

      <div className="fade-in d2" style={{
        padding: 32, borderRadius: 22,
        background: 'linear-gradient(135deg, #07172a 0%, #102944 60%, #1a365d 100%)',
        color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-strong)',
      }}>
        <div style={{ position: 'absolute', right: -80, top: -80, width: 320, height: 320, background: 'radial-gradient(circle, rgba(178,34,52,0.30), transparent 70%)', borderRadius: 999 }} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40 }}>
          <div>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.86)', maxWidth: 520, margin: 0 }}>
              Twelve weeks from blank canvas to a portfolio worth showing. Five courses, two live cohorts with practitioners from Linear, Figma and Notion, and a private community room with the others on your path.
            </p>
            <div style={{ marginTop: 28, display: 'grid', gap: 12 }}>
              {[
                { n: '01', t: 'Discovery & user research',   c: 'Helena Rosa',  w: 'Week 1–2' },
                { n: '02', t: 'Information architecture',    c: 'Daniel Park',  w: 'Week 3–4' },
                { n: '03', t: 'Design systems at scale',     c: 'Mariana Costa', w: 'Week 5–7' },
                { n: '04', t: 'The art of the prototype',    c: 'Daniel Park',  w: 'Week 8–9' },
                { n: '05', t: 'Portfolio & presentation',    c: 'Ada Okonkwo',  w: 'Week 10–12' },
              ].map((m) => (
                <div key={m.n} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  backdropFilter: 'blur(8px)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'rgba(255,255,255,0.14)',
                    color: '#fff',
                    display: 'grid', placeItems: 'center',
                    fontFamily: 'var(--font-num)',
                    fontWeight: 700, fontSize: 13,
                  }}>{m.n}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>{m.t}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.66)', marginTop: 2 }}>With {m.c}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)' }}>{m.w}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ padding: 22, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 14, backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Investment</div>
              <div style={{ fontFamily: 'var(--font-num)', fontSize: 52, fontWeight: 700, marginTop: 12, letterSpacing: '-0.015em', lineHeight: 1 }}>
                $1,290
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', marginTop: 6 }}>
                or <strong style={{ fontFamily: 'var(--font-num)' }}>$129</strong>/mo for 12 mo · 0% interest
              </div>
              <div style={{ marginTop: 22, display: 'grid', gap: 10, fontSize: 13 }}>
                {[
                  ['5 self-paced courses (108 lessons total)'],
                  ['2 live cohort weekends with faculty'],
                  ['Portfolio review · 1:1 · 60 min'],
                  ['Private community room · 320 alumni'],
                  ['Verified credential on completion'],
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'rgba(255,255,255,0.92)' }}>
                    <span style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--color-success)', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Icon name="check" size={11} />
                    </span>
                    {row[0]}
                  </div>
                ))}
              </div>
              <button className="btn btn-accent btn-lg" style={{ width: '100%', marginTop: 22 }}>
                Enroll · cohort Aug 18 <Icon name="arrowR" size={14} />
              </button>
              <div style={{ fontSize: 11, textAlign: 'center', marginTop: 12, color: 'rgba(255,255,255,0.6)' }}>
                14-day money-back · no questions.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
};

window.Paths = Paths;
