/* Credentials — earned + in-progress certificates */

const Credentials = () => {
  const [filter, setFilter] = useState('all');

  const creds = [
    {
      id: 'cr1', title: 'Pricing & packaging', instructor: 'Tomás Beltrán', issuer: 'Notion',
      issued: 'Apr 24, 2026', credentialId: 'SK-2026-001834',
      hours: 18, modules: 6, score: 94,
      tone: 'navy', done: true, verified: true,
    },
    {
      id: 'cr2', title: 'The art of the prototype', instructor: 'Daniel Park', issuer: 'Figma',
      issued: 'Feb 02, 2026', credentialId: 'SK-2026-000412',
      hours: 12, modules: 5, score: 88,
      tone: 'red', done: true, verified: true,
    },
    {
      id: 'cr3', title: 'Calm leadership', instructor: 'Ada Okonkwo', issuer: 'Vercel',
      issued: 'Nov 18, 2025', credentialId: 'SK-2025-014821',
      hours: 24, modules: 8, score: 96,
      tone: 'green', done: true, verified: true,
    },
    // in progress
    {
      id: 'cr4', title: 'Design Systems at scale', instructor: 'Mariana Costa', issuer: 'Linear',
      progress: 64, hours: 38, modules: 12,
      tone: 'navy', done: false,
    },
    {
      id: 'cr5', title: 'Editing as a craft', instructor: 'Helena Rosa', issuer: 'Stripe Press',
      progress: 12, hours: 18, modules: 7,
      tone: 'warm', done: false,
    },
  ];

  const filtered = creds.filter(c => filter === 'all' ? true : filter === 'earned' ? c.done : !c.done);

  return (
    <div>
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div>
          <span className="eyebrow">Credentials</span>
          <h1 className="display-h2" style={{ marginTop: 10 }}>Verified, shareable, yours.</h1>
          <p className="lede" style={{ marginTop: 12, fontSize: 14 }}>
            Every certificate is signed by Skillset and verifiable at <strong style={{ color: 'var(--color-ink)' }}>skillset.com/verify</strong>.
          </p>
        </div>
        <button className="btn btn-ghost"><Icon name="download" size={13} /> Export all (.zip)</button>
      </div>

      {/* Stats */}
      <div className="creds-stats fade-in d1">
        <div className="stat"><div className="l">Earned</div><div className="v">3</div></div>
        <div className="stat"><div className="l">In progress</div><div className="v">2</div></div>
        <div className="stat"><div className="l">Total hours</div><div className="v">54</div></div>
        <div className="stat"><div className="l">Avg score</div><div className="v">92.7</div></div>
      </div>

      {/* Filter pills */}
      <div className="fade-in d2" style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { id: 'all',     label: 'All' },
          { id: 'earned',  label: 'Earned' },
          { id: 'inprog',  label: 'In progress' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '8px 14px',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              borderRadius: 9,
              border: '1px solid var(--color-line)',
              background: filter === f.id ? 'var(--color-primary)' : '#fff',
              color: filter === f.id ? '#fff' : 'var(--color-ink-soft)',
              cursor: 'pointer',
              transition: 'all var(--duration-base) var(--ease-standard)',
              fontFamily: 'inherit',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="cred-grid fade-in d2">
        {filtered.map((c) => (
          <div key={c.id} className={'cred ' + (c.done ? '' : 'locked')}>
            <div className="certificate" style={{
              background: c.done
                ? `linear-gradient(135deg, #fff 0%, ${c.tone === 'navy' ? '#f4f8fd' : c.tone === 'red' ? '#fdf3f4' : c.tone === 'green' ? '#f1faf5' : '#fcf6ec'} 100%)`
                : '#fff'
            }}>
              <div className="cert-band">
                <div className="cert-mark" style={{
                  background: c.tone === 'navy' ? 'var(--color-primary)'
                            : c.tone === 'red'  ? 'var(--color-accent)'
                            : c.tone === 'green' ? 'var(--color-success)'
                            : '#c07b0a'
                }}>
                  <Icon name="award" size={18} />
                </div>
                <div>
                  <div className="cert-meta">{c.done ? 'Verified certificate' : 'In progress'} <span className="id">{c.credentialId || '—'}</span></div>
                </div>
              </div>
              <div className="cert-title">{c.title}</div>
              <div className="cert-issued">
                {c.done
                  ? <>Issued <strong>{c.issued}</strong> · Skillset, signed by <strong>{c.instructor}</strong></>
                  : <>You\u2019re {c.progress}% through this course.</>
                }
              </div>
            </div>

            <div className="body">
              <div className="by">With <strong>{c.instructor}</strong> · {c.issuer}</div>
              {c.done ? (
                <>
                  <div className="row">
                    <div className="item"><div className="l">Hours</div><div className="v">{c.hours}h</div></div>
                    <div className="item"><div className="l">Modules</div><div className="v">{c.modules}</div></div>
                    <div className="item"><div className="l">Score</div><div className="v">{c.score}/100</div></div>
                  </div>
                  <div className="cta-row">
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }}><Icon name="download" size={11} /> Download PDF</button>
                    <button className="btn btn-ghost btn-sm"><Icon name="globe" size={11} /> Share</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="progress">
                    <div className="bar"><div className="fill" style={{ width: c.progress + '%' }} /></div>
                    <div className="row">
                      <span>{c.modules} modules · {c.hours}h total</span>
                      <span className="pct">{c.progress}%</span>
                    </div>
                  </div>
                  <div className="cta-row">
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Continue <Icon name="arrowR" size={11} /></button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Linkedin / shareable explainer */}
      <div className="fade-in d3" style={{
        marginTop: 40, padding: 28, borderRadius: 18,
        background: 'linear-gradient(135deg, #07172a 0%, #1a365d 100%)',
        color: '#fff', position: 'relative', overflow: 'hidden',
        boxShadow: 'var(--shadow-strong)',
      }}>
        <div style={{ position: 'absolute', right: -80, top: -80, width: 280, height: 280, background: 'radial-gradient(circle, rgba(178,34,52,0.30), transparent 70%)', borderRadius: 999 }} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.86)' }}>Why our certificates matter</span>
            <h2 className="display-h2" style={{ color: '#fff', marginTop: 12, fontSize: 32 }}>
              Verifiable at <strong style={{ color: 'var(--color-accent-soft)' }}>skillset.com/verify</strong>.
            </h2>
            <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.82)', maxWidth: 560 }}>
              Every certificate carries a unique ID, a signed PDF, and a public verification page. Recruiters can look it up in 10 seconds — no &ldquo;can you send me proof?&rdquo; emails.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button className="btn btn-accent">Add to LinkedIn</button>
              <button className="btn btn-on-dark">How verification works</button>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>Credential ID</div>
              <div style={{ fontFamily: 'var(--font-num)', fontSize: 18, fontWeight: 700, marginTop: 4, letterSpacing: '0.04em' }}>SK-2026-001834</div>
            </div>
            <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>Signature</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 4, color: 'rgba(255,255,255,0.86)', wordBreak: 'break-all' }}>
                d3f8a7b1c9e0f24a8b6d3e1f4c7a9d2b
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
};

window.Credentials = Credentials;
